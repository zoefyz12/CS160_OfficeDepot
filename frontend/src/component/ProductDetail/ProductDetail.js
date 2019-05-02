import React, {Component} from 'react';
import "./ProductDetail.css";
import logo from "../images/logo1.png";
import StarRatings from 'react-star-ratings';
import userService from "../../common/services/User/UserService";
import userStoreService from "../../common/services/User/UserStoreService";
import {Link} from "react-router-dom";

class ProductDetail extends Component {

    state = {
        itemData:[],
        status:"Out of Stock"
    };



    componentDidMount() {
        let body = {
            itemid: this.props.match.params.productId,

        };

        let quantity = null;
        console.log(body);
        userService.getItem(JSON.stringify(body)).then((data) => {


            console.log(data);
            this.setState({itemData: data});
            quantity = data.quantity;
            if (quantity > 0)
            {
                this.setState({status: "In Stock"});
            }

        }).catch((error) => {
            alert(error.message);
        });


    }

    addToShoppingcart = (event,itemid) => {

        userStoreService.addShoppingCartInfo(itemid);
        console.log(userStoreService.getShoppingCart())
        alert("Thanks to add this Item to the Shopping Cart")

    };

    render() {
        return (
                <div className="container-fluid">
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            <img className="rounded mx-auto d-block logo" src={logo}/>
                            <div className="btns float-right">              
                                <Link to="/">
                                    <button type="button" className="btn btn-link inline-block">
                                        <span className="glyphicon glyphicon-chevron-left"></span>
                                        Continue Shopping
                                    </button>
                                </Link>
                            
                                <button type="button" className="btn btn-link inline-block" onClick={() => {this.props.history.push('/cart')}}>
                                    <span className="glyphicon glyphicon-shopping-cart"/>
                                    Shopping Cart
                                </button>     
                            </div>
                        </div>
                        <div className = "panel-body">                            
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td className="pic">
                                            <img className="item-display" src={this.state.itemData.url} alt=""/>
                                        </td>
                                    
                                        <td className="info">                                       
                                            <div className="product-title">
                                                {this.state.itemData.name}
                                            </div>

                                            <div className="product-price">
                                                $ {this.state.itemData.price}
                                            </div>

                                            <div className="product-stock">
                                                {this.state.status}
                                            </div>
                                                                                                                                      
                                            <div>
                                                <button type="button" className="btn btn-success btn-lg" onClick={(event)=> this.addToShoppingcart(event,this.state.itemData.itemid)}>
                                                    Add to cart
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    

                        <div className="panel-footer">
                            <div className="col-md-12 product-info">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home"
                                            role="tab" aria-controls="home" aria-selected="true">Description
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile"
                                        role="tab" aria-controls="profile" aria-selected="false">Product Info
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-margin tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div id="description">
                                            {this.state.itemData.description}   
                                        </div>
                                    </div>            
                                    <div className="tab-margin tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div id="category">
                                            • Category: {this.state.itemData.category}
                                        </div>
                                        <div id="weight">
                                            • Weight: {this.state.itemData.weight} lb
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>      
                    </div>
                </div>
        )
    }
}

export default ProductDetail;