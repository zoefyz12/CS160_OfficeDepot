const sqlite = require('sqlite3').verbose();
const jwtauth = require('./auth/jwtauth');

'use strict';
var crypto = require('crypto');

var genRandomString = function(length){
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex')
		.slice(0,length);
};


var sha256 = function(password, salt){
	var hash = crypto.createHmac('sha256', salt);
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt:salt,
		passwordHash:value
	};
};

function saltHashPassword(userpassword,salt) {
	if (salt.length < 1)
		salt = genRandomString(16);
	var passwordData = sha256(userpassword, salt);
	return passwordData;
}





function getDatabase(command, vars, cb)
{
	const db = new sqlite.Database('./data/cs160osd.db', (err) => {
		if (err) {
			console.error(err.message);
		}
	});

	if (vars === "")
	{
		db.all(command,[], (error, row) => {
			if (error) {
				throw error;
			}
			db.close();
			return cb(row);
		});
	}
	else {
		db.get(command, vars, (error, row) => {
			if (error) {
				throw error;
			}
			db.close();
			return cb(row);
		});
	}
}

function setDatabase(command, vars, cb)
{
	const db = new sqlite.Database('./data/cs160osd.db', (err) => {
		if (err) {
			console.error(err.message);
		}
	});

	db.run(command, vars, (error, row) => {
		if (error) {
			throw error;
		}
		db.close();
		return cb(row);
	});
}

function getpair(id,quantity)
{
	var str = "";
	for (var i = 0; i < id.length; i++)
	{
		str = str + "(" + id[i] + "," + quantity[i] + ")" + ",";
	}
	str = str.slice(0,-1);
	return str;
}

function getpair2(orderid, itemids, warehousenums, quantities, priority)
{
	var str = "";
	var status = "'processing'";
	if (priority < 2)
	{
		status = "'delivered'";
	}
	for (var i = 0; i < itemids.length; i++)
	{

		str = str + "(" + orderid + "," + itemids[i] + "," + warehousenums[i] + "," + quantities[i] + "," + status + "),";
	}
	return str.slice(0,-1);
}

const registerUser = (request, response) => {
	var {firstname, lastname, email, password} = request.body;
	var hashPass = saltHashPassword(password,"");
	password = hashPass.passwordHash;
	var salt = hashPass.salt;
	var userId = 1;


	getDatabase('SELECT email FROM users WHERE email = $1', [email],
		(result)=>{
			if (result === undefined)
			{
				setDatabase('INSERT INTO users (email, password,salt) VALUES (?, ?,?)', [email, password,salt],(t)=>{
					getDatabase('SELECT userid FROM users WHERE email = $1', [email],
						(result1)=> {
							if (result1 === undefined)
							{
								response.status(404).json("Cannot get value");
							}
							else{
								var userId = result1.userid;
								setDatabase('INSERT INTO customers (userid, firstname, lastname) VALUES (?, ?, ?)', [userId,firstname,lastname],(tt)=>{
									response.status(200).json("User added successfully");
								});
							}

						});
				});

			}
			else
			{
				response.status(404).json("User already exists");
			}
		});


}



const loginUser = (request, response) => {
	var {email, password} = request.body;
	getDatabase('SELECT * FROM users WHERE email = $1', [email],
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`Invalid email/password combination.`);
			}
			else
			{
				var salt = result.salt;
				var passHash = saltHashPassword(password,salt).passwordHash;
				var actualPass = result.password;
				console.log(actualPass);
				console.log(passHash);
				if (passHash === actualPass)
				{
					let token = jwtauth.generate({email: email});
					getDatabase('SELECT userid FROM users WHERE email = $1', [email], (t)=>{
						var userId = t.userid;
						getDatabase('SELECT firstname FROM customers WHERE userid = $1', [userId], (result1)=>
						{
							response.status(200).json({"userid": userId, "firstname" : result1.firstname, "level": result.level, "email": result.email, "token": token});
						})

					});
				}
				else {
					response.status(404).json("Invalid email / password combination");
				}
			}
		});
}

const getAll = (request, response) => {
	getDatabase('SELECT * FROM items WHERE quantity > 0', "",
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`There is no item to get.`);
			}
			else
			{
				response.status(200).json(result);

			}
		});
}

const getItem = (request, response) =>{
	const itemId = request.body.itemid;
	getDatabase('SELECT * FROM items WHERE itemid = $1', [itemId],
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`There is no item to get.`);
			}
			else
			{
				response.status(200).json(result);

			}
		});
}


const addItem = (request, response) =>{
	const {warehouseid, quantity, price, name, weight, description, category, url} = request.body;
	getDatabase('SELECT itemid, quantity from items WHERE name = $1', [name],(t)=>
	{
		if (t === undefined)
		{
			setDatabase('INSERT INTO items (warehouseid, quantity, price, name, weight, description, category,url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[warehouseid, quantity, price, name, weight, description, category, url],(result)=>
				{
					response.status(200).json("Item added successfully");
				});
		}
		else
		{
			var itemid = t.itemid;
			var oldQuantity = t.quantity;
			setDatabase("UPDATE items SET price = $1, quantity = $2 WHERE itemid = $3",[price,oldQuantity + quantity, itemid], (t1)=>{
				response.status(200).json("Successfully changed price and quantity of the existing item");
			});


		}
	});

}


function helperAvailable(itemids)
{
	var str = "";
	for (var i = 0; i < itemids.length; i++)
	{
		str = str + "(" + itemids[i]  + ")" + ",";
	}
	return str.slice(0,-1);
}

function sortTwoList(itemids, quantities)
{

	var list = [];
	for (var j = 0; j < itemids.length; j++)
		list.push({'itemid': itemids[j], 'quantity': quantities[j]});

	list.sort(function(a, b) {
		return ((a.itemid < b.itemid) ? -1 : ((a.itemid == b.itemid) ? 0 : 1));

	});

	return list;

}


const checkAvailable = (request, response) =>{
	const {itemids, quantities} = request.body;
	var listsorted = sortTwoList(itemids, quantities);
	for (var k = 0; k < listsorted.length; k++) {
		itemids[k] = listsorted[k].itemid;
		quantities[k] = listsorted[k].quantity;
	}
	var qr = "WITH Tmp(id) AS (VALUES" + helperAvailable(itemids) + ")";
	qr = qr + "SELECT itemid, quantity FROM items WHERE itemid IN (SELECT id FROM Tmp)";
	getDatabase(qr, "",
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`The item ids is incorrect`);
			}
			else
			{
				var ids = [];
				for (var i = 0; i < result.length; i++)
				{
					if (result[i].quantity < quantities[i])
					{
						ids.push(result[i].itemid);
					}
				}
				if (ids.length > 0)
					response.status(404).json(ids);
				else
					response.status(200).json("All Available");
			}
		});
}



function getWarehouseId(ids)
{
	var one = 0;
	var two = 0;
	for (var i = 0; i < ids.length; i++)
	{
		if (ids[i] === 1)
		{
			one++;
		}
		if (ids[i] === 2)
		{
			two++;
		}
	}
	if (one > 0 && two > 0)
		return 3;
	if (one > 0 && two < 1)
		return 1;
	if (one < 1 && two > 0)
		return 2;
}

const submitOrder = (request, response) => {
	const {userid, firstname, lastname, address, city, state, zip, phone, totalprice, itemids, quantities, priority, warehousenums, timestamp} = request.body;
	var warehouseid = getWarehouseId(warehousenums);
	var shipaddress = address + ", " + city + ", " + state + " " + zip;
	var pair = getpair(itemids, quantities);
	var qr = "WITH Tmp(id,quantity) AS (VALUES" + pair + ") UPDATE items SET quantity = quantity - ";
	qr = qr + "(SELECT quantity FROM Tmp WHERE items.itemid = Tmp.id) WHERE rowid IN (SELECT id FROM Tmp)";
	var priorities = [];
	for (var i = 0; i < itemids.length; i++)
		priorities.push(priority);

	setDatabase(qr, [],
		(result) => {
			setDatabase("INSERT INTO orders (userid, shipadd, phone, totalprice, orderdate, status, priority, warehouseid) VALUES (?,?,?,?,?,?,?,?)",
				[userid,shipaddress, phone, totalprice, timestamp, "processing",priority,warehouseid], (t)=>{
					getDatabase("SELECT orderid FROM orders WHERE userid = " + userid, "",(t1)=>{
						if (t1 === undefined)
						{
							response.status(200).json("Cannot get orders");
						}
						else {
							var orderid = t1[t1.length-1].orderid;
							var values = getpair2(orderid,itemids,warehousenums,quantities,priority);
							setDatabase("INSERT INTO itemsinorder (orderid, itemid, warehousenum, quantity,status) VALUES " + values,
								[],(t)=>{
									getDatabase("SELECT itemid FROM itemsinorder WHERE status = 'processing' AND orderid = " + orderid,[],(t5)=>{
										if (t5 === undefined)
										{
											setDatabase("UPDATE orders SET status = 'delivered' WHERE orderid = ?",[orderid],(t6)=>{

											});
										}
									});
									getDatabase("SELECT userid FROM useraddress WHERE userid = $1", [userid], (t3)=>{
										if (t3 === undefined)
										{
											setDatabase("INSERT INTO useraddress (userid, address, city, state,zip) VALUES (?,?,?,?,?)",
												[userid,address,city,state,zip],(t4)=> {
													var result = {"orderid": orderid}
													response.status(200).json(result);
												});
										}
										else
										{
											setDatabase("UPDATE useraddress SET address = ?, city = ?, state = ?, zip = ? WHERE userid = ?",
												[address,city,state,zip,userid],(t4)=> {
													response.status(200).json({"orderid": orderid});
												});
										}
									});
								});
						}
					});
				});
		});
}


const getOrderHistory = (request, response) =>{
	const userid = request.body.userid;
	getDatabase('SELECT * FROM orders WHERE userid = ' + userid, "",
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`Cannot get order history`);
			}
			else
			{
				response.status(200).json(result);
			}
		});
}

const getOrderHistoryDetail = (request, response) =>
{
	const {orderid} = request.body;
	var qr = "WITH history AS(";
	qr = qr + "SELECT * FROM itemsinorder WHERE itemsinorder.orderid = " + orderid + ")";
	qr = qr + "SELECT orderid, items.itemid, name, items.quantity, status, price, url FROM items, history WHERE items.itemid = history.itemid"
	getDatabase(qr, "",
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`Cannot get order history`);
			}
			else
			{
				response.status(200).json(result);

			}
		});
}

function helperShipAddress(arr, orderid)
{
	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i].orderid === orderid)
			return arr[i].shipadd;
	}
}
function getDifferentDate(date)
{
	var firstDate = new Date(date);
	var	secondDate = new Date();
	var timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
	var differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
	return differentDays - 1;
}

const getShipAddress = (request, response) =>
{
	getDatabase("SELECT orderid, shipadd, priority, orderdate, warehouseid FROM orders WHERE status= " + "'processing'", "",
		(result)=>{
			if (result === undefined)
			{
				response.status(404).json(`There are no orders that need to be delivered`);
			}
			else
			{
				var day_2 = [];
				var one = 0;
				var two = 0;
				var three = 0;
				for (var i = 0; i < result.length; i++)
				{
					if (result[i].priority === 2)
					{
						delete result[i].priority;
						delete result[i].orderdate;
						if (result[i].warehouseid === 1)
						{
							one++;
						}
						else if (result[i].warehouseid === 2)
						{
							two++;
						}
						else if (result[i].warehouseid === 3)
						{
							three++;
						}
						day_2.push(result[i]);
					}
					else if (result[i].priority > 2)
					{
						if (getDifferentDate(result[i].orderdate) > 0)
						{
							delete result[i].priority;
							delete result[i].orderdate;
							if (result[i].warehouseid === 1)
							{
								one++;
							}
							else if (result[i].warehouseid === 2)
							{
								two++;
							}
							else if (result[i].warehouseid === 3)
							{
								three++;
							}
							day_2.push(result[i]);
						}
					}
				}
				var idfinal = 2;
				if (three > 0)
				{
					idfinal = 3;
				}
				else if (one > 0 && two > 0)
				{
					idfinal = 3;
				}
				else if (one > 0 && two < 1)
				{
					idfinal = 1;
				}
				for (var i = 0; i < day_2.length; i++)
				{
					day_2[i].warehouseid = idfinal;
				}
				response.status(200).json(day_2);
			}
		});
}

const markDelivered = (request, response) =>
{

	const {orderids} = request.body;
	var qr = "WITH Tmp(orderid) AS (VALUES" + helperAvailable(orderids) + ")";
	var qr0 = qr + " SELECT * FROM orders WHERE orderid IN (SELECT orderid FROM Tmp)";
	qr0 = "WITH history AS (" + qr0 + ") SELECT orderid, status FROM history WHERE status = 'processing'";
	var qr1 = qr + " UPDATE itemsinorder SET status = 'delivered' WHERE orderid IN (SELECT orderid FROM Tmp)";
	var qr2 = qr + " UPDATE orders SET status = 'delivered' WHERE orderid IN (SELECT orderid FROM Tmp)";

	getDatabase(qr0,"",(t1)=>{
		if (t1.length != orderids.length)
		{
			response.status(404).json("Some of the orderid does not need to be updated");
		}
		else
		{
			setDatabase(qr1,[],(t)=>{
				setDatabase(qr2,[],(t6)=>{
					response.status(200).json("Update status sucessfully");
				});
			});

		}
	});


}

const deleteItem = (request, response) =>
{

	const {itemid} = request.body;
	getDatabase("SELECT * FROM items WHERE itemid = $1",[itemid],(t)=>
	{
		if (t === undefined)
		{
			response.status(404).json("The itemid is incorrect");
		}
		else
		{
			setDatabase("DELETE FROM items WHERE itemid = $1",[itemid],(t1)=>
			{
				response.status(200).json("Sucessfully deleted the item");
			});

		}
	});

	// response.status(200).json("hahah");
	// getDatabase(qr1,"",(t1)=>
	// {
	// 	if (t1.length != itemids.length)
	// 	{
	// 		response.status(404).json("Some of the item ids are not in the database!");
	// 	}
	// 	else
	// 	{
	// 		//
	// 		setDatabase(qr0,[],(t)=>
	// 		{
	//
	// 			response.status(200).json("Successfully deleted the items");
	//
	// 		});
	// 	}
	// });
}


// const setPrice = (request, response) =>
// {
//
// 	const {itemids, prices} = request.body;
// 	var qr = "WITH Tmp(id) AS (VALUES" + helperAvailable(itemids) + ")";
// 	qr = qr + "SELECT itemid FROM items WHERE itemid IN (SELECT id FROM Tmp)";
//
// 	var pair = getpair(itemids, prices);
// 	var qr1 = "WITH Tmp(id,price) AS (VALUES" + pair + ") UPDATE items SET price =  ";
// 	qr1 = qr1 + "(SELECT price FROM Tmp WHERE items.itemid = Tmp.id) WHERE itemid IN (SELECT id FROM Tmp)";
//
//
// 	var negative = 0;
// 	for (var i = 0; i < prices.length; i++)
// 	{
// 		if (prices[i] <= 0)
// 		{
// 			negative = 1;
// 		}
// 	}
// 	if (negative > 0)
// 	{
// 		response.status(404).json("Some of the prices are <= 0");
// 	}
// 	else
// 	{
// 		getDatabase(qr,"",(t1)=>
// 		{
// 			if (t1.length != itemids.length)
// 			{
// 				response.status(404).json("Some of the item ids are not in the database!");
// 			}
// 			else
// 			{
//
// 				setDatabase(qr1,[],(t)=>
// 				{
// 					response.status(200).json("Successfully set prices for items");
//
// 				});
// 			}
// 		});
// 	}
//
//
// }





module.exports = {
	registerUser,
	loginUser,
	getAll,
	getItem,
	addItem,
	checkAvailable,
	submitOrder,
	getOrderHistory,
	getOrderHistoryDetail,
	getShipAddress,
	markDelivered,
	deleteItem
}
