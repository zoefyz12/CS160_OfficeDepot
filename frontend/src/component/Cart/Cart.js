import React, {Component} from 'react';
import "./Cart.css"
import {Link} from "react-router-dom";
import UserStoreService from "../../common/services/User/UserStoreService";
import userService from "../../common/services/User/UserService";
import logo from "../images/logo1.png";

class Cart extends Component {

    state = {
        rows: UserStoreService.getShoppingCart(),
        itemId: [],
        qualities: [],
        itemList: [],
        totalPrice: 0,
        totalWeight: [],
        wareHouseNumbers: [],
    };

    componentDidMount() {


        let totalPrice = 0;
            let body = {
                authorization: UserStoreService.getToken(),
                userid: UserStoreService.getUserId(),
            };

            userService.getShoppingCart(JSON.stringify(body)).then((data) => {
                console.log(data);


                for(let i = 0; i < data.length; i++){
                    totalPrice = data[i].price * data[i].quantityInCart + totalPrice;
                }

                console.log(totalPrice,"totalPrice")
                this.setState({itemList: data, totalPrice: totalPrice.toFixed(2)});
                UserStoreService.setTotalPrice(totalPrice.toFixed(2));
                console.log(UserStoreService.getTotalPrice(),"Userstoreservice")
            }).catch((error) => {

                //alert(error.message)
            })



   //
   //  //    let unique = [...new Set(this.state.rows)];
   //      //console.log("6666",unique);
   //     // this.setState({itemId: unique});
   // //     console.log(this.state.itemId);
   //
   //      let list = [];
   //      let quality = [];
   //  //    console.log(quality[0],"quality")
   //      let price = [];
   //      let tPrice = 0;
   //      let totalP = 0;
   //      let wareHouse = [];
   //
   //      let real= Array(this.state.itemId.length).fill();
   //
   //
   //      let tWeight = 0;
   //      let weight = [];
   //      console.log(this.state.itemId,"item id list before call get Item for loop")
   //      for (let i = 0; i < this.state.itemId.length; i++) {
   //          let body = {
   //              itemid: this.state.itemId[i],
   //          };
   //          console.log(body);
   //          userService.getItem(JSON.stringify(body)).then((data) => {
   //              console.log(data,"getItem Data");
   //
   //              let index = this.state.itemId.indexOf(data.itemid);
   //
   //              list[index] = data;
   //              console.log(list,"getITEM list")
   //
   //              // Set WareHouse Id
   //              wareHouse.push(data.warehouseid);
   //              this.setState({wareHouseNumbers: wareHouse});
   //              console.log(this.state.wareHouseNumbers,"ware house ids");
   //              UserStoreService.setWareHouseId(this.state.wareHouseNumbers);
   //
   //              // Set Total Price
   //              tPrice =+ data.price * this.state.qualities[i];
   //              price.push(tPrice);
   //              this.setState({totalPrice: price});
   //              // console.log(tPrice,"dsafhjgfddasfgjf");
   //              // console.log(this.state.totalPrice,"dsafhjgfddasfgjf");
   //              UserStoreService.setTotalPrice(this.state.totalPrice.reduce(function (acc,currentValue) {
   //                  return acc + currentValue;
   //              }, 0).toFixed(2));
   //
   //              console.log(UserStoreService.getTotalPrice(), "fdjhgsdokjfkhbklk")
   //
   //              // Set Total Weight
   //              tWeight =+ data.weight * this.state.qualities[i];
   //              weight.push(tWeight);
   //              this.setState({totalWeight: weight});
   //              // console.log(tPrice,"dsafhjgfddasfgjf");
   //              // console.log(this.state.totalPrice,"dsafhjgfddasfgjf");
   //              UserStoreService.setTotalWeight(this.state.totalWeight.reduce(function (acc,currentValue) {
   //                  return acc + currentValue;
   //              }, 0).toFixed(2));
   //
   //
   //              // Set Shopping Cart List
   //              this.setState({itemList: list});
   //              console.log(this.state.itemId,"item Id shfdjogkpjdhksgajkjdlkf;")
   //              console.log(this.state.itemList,"item List shfdjogkpjdhksgajkjdlkf;")
   //              // let real = [];
   //              // for(let i = 0; i < this.state.itemId.length; i++){
   //              //     for(let i = 0; i < this.state.itemList.length; i++)
   //              //     {
   //              //         if(this.state.itemId[i] === this.state.itemList[i].itemid){
   //              //             real.push(this.state.itemList[i]);
   //              //         }
   //              //     }
   //              // }
   //              //
   //              // console.log(real,"real item list jhgfghjklhgfdxzfghjkl")
   //              //
   //
   //
   //          }).catch((error) => {
   //              alert(error.message);
   //          });
   //      }
   //
   //
   //      for (let i = 0; i < this.state.itemId.length; i++) {
   //          let count = 0;
   //          for(let j = 0; j < this.state.rows.length; j++) {
   //              if(this.state.itemId[i] === this.state.rows[j]){
   //                  count++;
   //                  quality[i] = count;
   //              }
   //          }
   //      }
   //      this.setState({qualities: quality});
   //
   //      // Set Item Ids
   //      UserStoreService.setItemId(this.state.itemId);
   //
   //      //
   //      // // Set Quantities
   //      // UserStoreService.setQuantities(this.state.qualities);
   //      // console.log(this.state.qualities,"quantities")




    }

    handleRemoveRow = (itemid, idx) => {



   //      let r = this.state.itemList[idx];
   //      let p = this.state.itemId[idx];
   //
   //      let l = this.state.itemId.filter(function (row) {
   //          return row !== p;
   //      });
   //      let longList = this.state.rows.filter(function (row) {
   //          return row !== p;
   //      });
   //      let q = this.state.qualities.filter(function(value, index, arr){
   //
   //          return index !== idx;
   //
   //      });
   //      let deletequalities = this.state.qualities.splice(idx,1)
   //
   //
   //      // let totalPrice = 0;
   //      // for(let i = 0; i < q.length; i++){
   //      //     totalPrice = totalPrice + q[i] * this.state.itemList[i].price;
   //      // }
   //      console.log(q,"myqualitiy")
   //      this.setState({
   //          itemList: this.state.itemList.filter(function (row) {
   //
   //              return row !== r;
   //
   //          }), itemId: l, qualities: q, rows: longList,
   //      });
   //
   // //     console.log(this.state.totalPrice - (r.price * deletequalities), "newPrice")
   //      console.log(l,"itemId list");
   //      console.log(longList,"item long list");
   //      console.log(this.state.itemList,"item list");
   //      UserStoreService.setItemId(l);
   //      UserStoreService.setShoppingCart(longList);
   //      UserStoreService.setQuantities(q);
   //      UserStoreService.setTotalPrice((UserStoreService.getTotalPrice() - r.price * deletequalities).toFixed(2));
        let body = {
            authorization: UserStoreService.getToken(),
            userid: UserStoreService.getUserId(),
            itemid: itemid,
        };

        userService.deleteShoppingCart(JSON.stringify(body)).then((data) => {
            console.log(data);
            let r = this.state.itemList[idx];

            let newTotalPrice = (parseFloat(this.state.totalPrice) -  this.state.itemList[idx].quantityInCart* this.state.itemList[idx].price).toFixed(2)

            this.setState({
                itemList: this.state.itemList.filter(function (row) {

                    return row !== r;

                }), totalPrice: newTotalPrice
            });
            console.log(this.state.itemList,"itemList")

            alert("Delete Item Successfully")
            // console.log(this.props,"my props")
            //
            // // this.props.history.push('/')
            // this.forceUpdate()

        }).catch((error) => {
            alert(error.message);
        });


    };

    checkAvailable = (event,props) => {

        let body = {
            authorization: UserStoreService.getToken(),
            userid: UserStoreService.getUserId(),
        };
        userService.getShoppingCart(JSON.stringify(body)).then((data) => {
            console.log(data);
            let id = null;
            let ids = [];
            let quantity = null;
            let quantities = [];
            let weight = 0;
            let wareHouse = [];
            let price = 0;
            for(let i = 0; i < data.length; i++){
                id = data[i].itemid;
                ids.push(id);
                quantity = data[i].quantityInCart;
                quantities.push(quantity)
                weight = data[i].weight * quantity + weight
                wareHouse.push(data[i].warehouseid)
                price = price + data[i].price * data[i].quantityInCart
            }
            this.setState({itemId: ids, qualities: quantities})
            UserStoreService.setItemId(ids);
            UserStoreService.setQuantities(quantities);
            UserStoreService.setTotalWeight(weight);
            UserStoreService.setWareHouseId(wareHouse);
            UserStoreService.setTotalPrice(price);
            let body = {
                authorization: UserStoreService.getToken(),
                itemids: this.state.itemId,
                quantities: this.state.qualities,
            };
            console.log(this.state.qualities,"quality")
            if(this.state.qualities[0] !== undefined) {
                userService.checkAvailable(JSON.stringify(body)).then((data) => {
                    console.log(data);

                    alert(data);
                    props.history.push('/checkout')
                }).catch((error) => {
                    alert(error.message);
                });
            }
        }).catch((error) => {

            //alert(error.message)
        })

        // UserStoreService.setQuantities(this.state.qualities);
        // event.preventDefault();
        //
        console.log(this.state.itemId,"itemids");
        console.log(this.state.qualities,"quantilits")



    };



    // getTotalPrice = () => {
    //
    //     console.log(this.handleRemoveRow.r,"my r")
    //     if(this.handleRemoveRow.r !== undefined && this.handleRemoveRow.deletequalities !== undefined)
    //     {
    //         return this.state.totalPrice.reduce(function (acc,currentValue) {
    //             return acc + currentValue;
    //         }, 0).toFixed(2) - this.handleRemoveRow.r.price * this.handleRemoveRow.deletequalities
    //     }
    //     else {
    //         return this.state.totalPrice.reduce(function (acc, currentValue) {
    //             return acc + currentValue;
    //         }, 0).toFixed(2);
    //     }
    // };

    editShoppingCart = (itemid, idx) => {

        if(document.getElementById(itemid).value > 0) {
            let body = {
                authorization: UserStoreService.getToken(),
                userid: UserStoreService.getUserId(),
                itemid: itemid,
                quantity: document.getElementById(itemid).value,
            };


            userService.editShoppingCart(JSON.stringify(body)).then((data) => {
                console.log(data);
                let q = document.getElementById(itemid).value;
                let quan = this.state.itemList;
                if(q >= quan[idx].quantityInCart){
                    let newTotalPrice = (parseFloat(this.state.totalPrice) + (q - quan[idx].quantityInCart) * quan[idx].price).toFixed(2)
                    console.log(parseInt(this.state.totalPrice),"totalPrice");
                    console.log(q - quan[idx].quantityInCart,"quantity");
                        console.log(((q - quan[idx].quantityInCart) * quan[idx].price), "Price");
                    this.setState({totalPrice: newTotalPrice})
                }
                else{
                    let newTotalPrice = (parseFloat(this.state.totalPrice) - (quan[idx].quantityInCart - q) * quan[idx].price).toFixed(2)
                    this.setState({totalPrice: newTotalPrice})
                }

                quan[idx].quantityInCart = q;

                this.setState({itemList: quan})

                alert("Thanks to update quantity of this Item")


            }).catch((error) => {
                alert(error.message);
            });
        }
        else if (document.getElementById(itemid).value === 0){
            let body = {
                authorization: UserStoreService.getToken(),
                userid: UserStoreService.getUserId(),
                itemid: itemid,
            };

            userService.deleteShoppingCart(JSON.stringify(body)).then((data) => {
                console.log(data);
                let r = this.state.itemList[idx];

                let newTotalPrice = (parseFloat(this.state.totalPrice) -  this.state.itemList[idx].quantityInCart* this.state.itemList[idx].price).toFixed(2)

                this.setState({
                    itemList: this.state.itemList.filter(function (row) {

                        return row !== r;

                    }), totalPrice: newTotalPrice
                });
                console.log(this.state.itemList,"itemList")

                alert("Delete Item Successfully")
                // console.log(this.props,"my props")
                //
                // // this.props.history.push('/')
                // this.forceUpdate()

            }).catch((error) => {
                alert(error.message);
            });
        }
        else{
            alert("Please enter non-negative number")
        }

    };

    render() {
        return (
            <div>
                <div className="container">
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            <div className="logo">
                                <img className="rounded mx-auto d-block" src={logo}/>
                            </div>
                            <div className="panel-title">
                                <div className="header">
                                    <h5>
                                        <span className="glyphicon glyphicon-shopping-cart"/> Shopping Cart
                                    </h5>
                                </div>
                                <div className="header padButton">
                                    <Link to="/">
                                        <button type="button" className=" btn btn-link btn-md">
                                            <span className="glyphicon glyphicon-chevron-left"></span>
                                            Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="panel-body">

                            {this.state.itemList.length > 0 &&
                            <div>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th className="text-center itemName"></th>
                                        <th className="text-center itemColLarge">Weight(lbs)</th>
                                        <th className="text-center itemColLarge">Unit Price</th>
                                        <th className="text-center itemColSmall">Quantity</th>
                                        <th className="text-center itemColLarge">Edit Quantity</th>
                                        <th className="text-center itemColSmall">Subtotal</th>
                                        <th className="text-center itemColSmall">Remove All</th>
                                    </tr>
                                    </thead>

                                    <tbody>


                                    {this.state.itemList.map((item, idx) => (
                                        <tr key={item.itemid}>
                                            <td>
                                                <div className="row">
                                                    <div className="col">
                                                        <img className="CartImgSize img-responsive" src={item.url}/>
                                                    </div>
                                                    <div className="col">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="cell">
                                                {item.weight}
                                            </td>
                                            <td className="cell">
                                                ${item.price}
                                            </td>

                                            <td className="cell">
                                                <input type="number" className="form-control input-sm inline-block" id={item.itemid} defaultValue={item.quantityInCart}/>
                                                {console.log(item.quantityInCart)}
                                            </td>
                                            <td className="cell">
                                                <button type="button" className="btn btn-danger cartBtn" onClick={() => this.editShoppingCart(item.itemid, idx)}>
                                                    Apply
                                                </button>
                                            </td>

                                            <td className="cell">
                                                ${(item.price * item.quantityInCart).toFixed(2)}
                                            </td>
                                            <td className="cell">
                                                <div>
                                                <button onClick={() => this.handleRemoveRow(item.itemid, idx)} type="button" className="btn btn-link btn-lg mx-auto">
                                                <span className="glyphicon glyphicon-trash"> </span>
                                                </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>}
                            {this.state.itemList.length === 0 &&
                            <div className="panel panel-default">
                                <div className="panel-body panel-empty text-center">
                                    <h5>Your shopping cart is empty.</h5>
                                </div>
                            </div>
                            }

                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col padTotal text-right">
                                    <h3>

                                        Total:    <strong>${this.state.totalPrice}</strong>
                                    </h3>
                                    <h6>
                                        Shipping calculated at checkout
                                    </h6>
                                </div>
                            </div>
                            <div className="float-right">

                                <button type="button" className="btn btn-danger"
                                        onClick={(event) => this.checkAvailable(event,this.props)}>
                                    <span className="glyphicon glyphicon-share-alt"></span>  Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>     
                </div>
            </div>
        );
    }
}

export default Cart;