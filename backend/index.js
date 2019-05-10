const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3006;
const db = require('./queries');
const jwtauth = require('./auth/jwtauth');

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(cors());
app.options('*', cors());

app.get('/', (request, response) => {
	response.json({info: 'Node.js, Express, and Postgres API'});
});

app.post('/login', db.loginUser);
app.post('/register', db.registerUser);
app.post('/getItem', db.getItem);
app.post('/getAll', db.getAll);
app.post('/checkAvailable', jwtauth.validate,db.checkAvailable);
app.post('/addItem', jwtauth.validate,db.addItem);
app.post('/submitOrder',jwtauth.validate,db.submitOrder);
app.post('/getOrderHistory', jwtauth.validate,db.getOrderHistory);
app.post('/getOrderHistoryDetail', jwtauth.validate,db.getOrderHistoryDetail);
app.post('/getShipAddress', jwtauth.validate,db.getShipAddress);
app.post('/markDelivered', jwtauth.validate,db.markDelivered);
app.post('/deleteItem', jwtauth.validate, db.deleteItem);
app.post('/addShoppingCart', jwtauth.validate, db.addShoppingCart);
app.post('/deleteShoppingCart', jwtauth.validate, db.deleteShoppingCart);
app.post('/getShoppingCart', jwtauth.validate, db.getShoppingCart);
app.post('/deleteWholeShoppingCart', jwtauth.validate, db.deleteWholeShoppingCart);
app.post('/editShoppingCart', jwtauth.validate, db.editShoppingCart);

app.listen(port, () => {
	console.log(`App running on port ${port}.`);
});