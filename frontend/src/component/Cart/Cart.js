import React, {Component} from 'react';
import "./Cart.css"
import {Link} from "react-router-dom";
import UserStoreService from "../../common/services/User/UserStoreService";
import userService from "../../common/services/User/UserService";
import logo from "../images/logo1.png";

class Cart extends Component {

    state = {
        rows: UserStoreService.getShoppingCart(),
        itemId:[...new Set(UserStoreService.getShoppingCart())],
        qualities: undefined,
        itemList: [],
        totalPrice: UserStoreService.setTotalPrice(0),
        totalWeight: [],
        wareHouseNumbers: [],
    };

    componentDidMount() {


    //    let unique = [...new Set(this.state.rows)];
        //console.log("6666",unique);
       // this.setState({itemId: unique});
   //     console.log(this.state.itemId);

        let list = [];
        let quality = [];
    //    console.log(quality[0],"quality")
        let price = [];
        let tPrice = 0;
        let totalP = 0;
        let wareHouse = [];

        let real= Array(this.state.itemId.length).fill();


        let tWeight = 0;
        let weight = [];
        console.log(this.state.itemId,"item id list before call get Item for loop")
        for (let i = 0; i < this.state.itemId.length; i++) {
            let body = {
                itemid: this.state.itemId[i],
            };
            console.log(body);
            userService.getItem(JSON.stringify(body)).then((data) => {
                console.log(data,"getItem Data");

                let index = this.state.itemId.indexOf(data.itemid);

                list[index] = data;
                console.log(list,"getITEM list")

                // Set WareHouse Id
                wareHouse.push(data.warehouseid);
                this.setState({wareHouseNumbers: wareHouse});
                console.log(this.state.wareHouseNumbers,"ware house ids");
                UserStoreService.setWareHouseId(this.state.wareHouseNumbers);

                // Set Total Price
                tPrice =+ data.price * this.state.qualities[i];
                price.push(tPrice);
                this.setState({totalPrice: price});
                // console.log(tPrice,"dsafhjgfddasfgjf");
                // console.log(this.state.totalPrice,"dsafhjgfddasfgjf");
                UserStoreService.setTotalPrice(this.state.totalPrice.reduce(function (acc,currentValue) {
                    return acc + currentValue;
                }, 0).toFixed(2));

                console.log(UserStoreService.getTotalPrice(), "fdjhgsdokjfkhbklk")

                // Set Total Weight
                tWeight =+ data.weight * this.state.qualities[i];
                weight.push(tWeight);
                this.setState({totalWeight: weight});
                // console.log(tPrice,"dsafhjgfddasfgjf");
                // console.log(this.state.totalPrice,"dsafhjgfddasfgjf");
                UserStoreService.setTotalWeight(this.state.totalWeight.reduce(function (acc,currentValue) {
                    return acc + currentValue;
                }, 0).toFixed(2));


                // Set Shopping Cart List
                this.setState({itemList: list});
                console.log(this.state.itemId,"item Id shfdjogkpjdhksgajkjdlkf;")
                console.log(this.state.itemList,"item List shfdjogkpjdhksgajkjdlkf;")
                // let real = [];
                // for(let i = 0; i < this.state.itemId.length; i++){
                //     for(let i = 0; i < this.state.itemList.length; i++)
                //     {
                //         if(this.state.itemId[i] === this.state.itemList[i].itemid){
                //             real.push(this.state.itemList[i]);
                //         }
                //     }
                // }
                //
                // console.log(real,"real item list jhgfghjklhgfdxzfghjkl")
                //


            }).catch((error) => {
                alert(error.message);
            });
        }


        for (let i = 0; i < this.state.itemId.length; i++) {
            let count = 0;
            for(let j = 0; j < this.state.rows.length; j++) {
                if(this.state.itemId[i] === this.state.rows[j]){
                    count++;
                    quality[i] = count;
                }
            }
        }
        this.setState({qualities: quality});

        // Set Item Ids
        UserStoreService.setItemId(this.state.itemId);

        //
        // // Set Quantities
        // UserStoreService.setQuantities(this.state.qualities);
        // console.log(this.state.qualities,"quantities")




    }

    handleRemoveRow = (idx) => {



        let r = this.state.itemList[idx];
        let p = this.state.itemId[idx];

        let l = this.state.itemId.filter(function (row) {
            return row !== p;
        });
        let longList = this.state.rows.filter(function (row) {
            return row !== p;
        });
        let q = this.state.qualities.filter(function(value, index, arr){

            return index !== idx;

        });
        let deletequalities = this.state.qualities.splice(idx,1)


        // let totalPrice = 0;
        // for(let i = 0; i < q.length; i++){
        //     totalPrice = totalPrice + q[i] * this.state.itemList[i].price;
        // }
        console.log(q,"myqualitiy")
        this.setState({
            itemList: this.state.itemList.filter(function (row) {

                return row !== r;

            }), itemId: l, qualities: q, rows: longList,
        });

   //     console.log(this.state.totalPrice - (r.price * deletequalities), "newPrice")
        console.log(l,"itemId list");
        console.log(longList,"item long list");
        console.log(this.state.itemList,"item list");
        UserStoreService.setItemId(l);
        UserStoreService.setShoppingCart(longList);
        UserStoreService.setQuantities(q);
        UserStoreService.setTotalPrice((UserStoreService.getTotalPrice() - r.price * deletequalities).toFixed(2));


    };

    checkAvailable = (event,props) => {


        UserStoreService.setQuantities(this.state.qualities);
        event.preventDefault();
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


    };



    getTotalPrice = () => {

        console.log(this.handleRemoveRow.r,"my r")
        if(this.handleRemoveRow.r !== undefined && this.handleRemoveRow.deletequalities !== undefined)
        {
            return this.state.totalPrice.reduce(function (acc,currentValue) {
                return acc + currentValue;
            }, 0).toFixed(2) - this.handleRemoveRow.r.price * this.handleRemoveRow.deletequalities
        }
        else {
            return this.state.totalPrice.reduce(function (acc, currentValue) {
                return acc + currentValue;
            }, 0).toFixed(2);
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
                                        <th className="text-center itemColSmall">Qty</th>
                                        <th className="text-center itemColLarge">Subtotal</th>
                                        <th className="text-center itemColSmall">Remove</th>
                                    </tr>
                                    </thead>

                                    <tbody>


                                    {this.state.itemList.map((item, idx) => (
                                        <tr>
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
                                                {this.state.qualities[idx]}
                                            </td>
                                            <td className="cell">
                                               ${(item.price * this.state.qualities[idx]).toFixed(2)}
                                            </td>
                                            <td className="cell"> 
                                                <div>
                                                    <button onClick={() => this.handleRemoveRow(idx)} type="button" className="btn btn-link btn-lg mx-auto">
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
                                        {console.log(UserStoreService.getTotalPrice())}
                                        Total:    <strong>${UserStoreService.getTotalPrice()}</strong>
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