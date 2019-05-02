import React, {Component} from 'react';
import "./Checkout.scss"
import Form from "react-bootstrap/Form";
import userService from "../../common/services/User/UserService";
import UserStoreService from "../../common/services/User/UserStoreService";
import logo from "../images/logo1.png";


class Checkout extends Component {
    state = {
        submitDeliveryMethod: false,
        shippingDisable: false,
        shippingMethodDisable: false,
        over: UserStoreService.isOver(),
        under: UserStoreService.isUnder(),
        underWeight: UserStoreService.isUnderWeight(),
        overWeight: UserStoreService.isOverWeight(),
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        pickup: null,
        renew: [],
        priority: null,
        showShippingMethodStep: false,
        showPaymentStep: false,
    };


    componentDidMount(){
        let today = new Date().toLocaleDateString();

        console.log(today,"today")
    }

        shippingAddressSubmit = (event) => {

            this.setState({
                showShippingMethodStep: true,
                shippingDisable: true,
                firstName: event.target.fname.value,
                lastName: event.target.lname.value,
                address: event.target.address.value,
                city: event.target.city.value,
                state: event.target.state.value,
                zip: event.target.zipcode.value,
                phone: event.target.phone.value,
            });
            event.preventDefault();



    };

    orderSubmit = (event) => {
        event.preventDefault();
        // console.log(this.state.pickup, "pickup")
        // console.log(UserStoreService.getTotalPrice(), "old total price")
        // if(this.state.pickup === true){
        //     UserStoreService.setTotalPrice(parseFloat(UserStoreService.getTotalPrice()) + 20);
        //
        //     console.log(UserStoreService.getTotalPrice(), "new total price")
        // }

        let body = {
            authorization: UserStoreService.getToken(),
            userid: UserStoreService.getUserId(),
            firstname: this.state.firstName,
            lastname: this.state.lastName,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            phone: this.state.phone,
            totalprice: UserStoreService.getTotalPrice(),
            itemids: UserStoreService.getItemId(),
            quantities: UserStoreService.getQuantities(),
            priority: this.state.priority,
            warehousenums: UserStoreService.getWareHouseId(),
            timestamp: new Date().toLocaleDateString(),
        };

        console.log(body,"orderSubmit body")
        userService.submitOrder(JSON.stringify(body)).then((data) => {
            console.log(data);

            alert('Order Submitted');
            this.props.history.push('/')
            UserStoreService.setShoppingCart(this.state.renew);
            UserStoreService.setTotalPrice(null);
        }).catch((error) => {
            alert(error.message);
        });
        console.log(this.state.firstName,"fname")


    };



    submitDelivery =() =>{
        if(this.state.pickup === null)
        {
            this.setState({showPaymentStep: false});
        }
        else
            this.setState({shippingMethodDisable: true, submitDeliveryMethod: true, showPaymentStep: true});
        if(this.state.pickup === "1") // Over $100, Free
        {
            if(UserStoreService.getTotalWeight() >= 15)
            {
                this.setState({
                    priority: 3  // Free 2-day truck
                })
            }
            else{
                this.setState({
                    priority: 0  // Free 1-day drone 
                })
            }
        }
        if(this.state.pickup === "2")  // Over $100,  Pay
        {

            UserStoreService.setTotalPrice(parseFloat(UserStoreService.getTotalPrice()) + 25);
            this.setState({
                priority: 2  // Pay $25 for 1-day truck
            })

        }
        if(this.state.pickup === "3")  // Free Self-pickup at warehouse
        {
            this.setState({
                priority: 1 
            })

        }
        if(this.state.pickup === "4")  // Under $100
        {
            UserStoreService.setTotalPrice(parseFloat(UserStoreService.getTotalPrice()) + 20);
            if(UserStoreService.getTotalWeight() >= 15)
            {
                this.setState({
                    priority: 3  // Pay $20 for 2-day truck 
                })
            }
            else{
                this.setState({
                    priority: 0  // Free 1-day drone
                })
            }

        }


        console.log(this.state.pickup)


    };




    render() {
        return (
                <div className="container">
                    <img className="rounded mx-auto d-block logo" src={logo}/>

                    <div className="card-box">
                        <h4 className="m-t-0 header-title">
                            <b>Shipping Information</b>
                        </h4>
                        <p className="text-muted m-b-30 font-13">
                            Enter checkout information:
                        </p>
                        <form onSubmit={(event) => this.shippingAddressSubmit(event)}>
                            <div className="form-group">
                                <label htmlFor="fisrtName">First Name<span className="text-danger">*</span></label>
                                <input type="text" name="fname" required disabled={this.state.shippingDisable}
                                       placeholder="First Name" className="form-control" id="firstName" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name<span className="text-danger">*</span></label>
                                <input type="text" name="lname" required disabled={this.state.shippingDisable}
                                       placeholder="Last Name" className="form-control" id="lastName" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address<span className="text-danger">*</span></label>
                                <input type="text"  name="address" placeholder="Address" required disabled={this.state.shippingDisable}
                                       className="form-control"  />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City<span className="text-danger">*</span></label>
                                <input type="text" name="city" required disabled={this.state.shippingDisable}
                                       placeholder="City" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State<span className="text-danger">*</span></label>
                                <input type="text" required disabled={this.state.shippingDisable}
                                       placeholder="State" name="state" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipcode">Zip Code<span className="text-danger">*</span></label>
                                <input type="text" required disabled={this.state.shippingDisable}
                                       placeholder="Zip Code" name="zipcode" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phonenumber">Phone Number<span className="text-danger">*</span></label>
                                <input type="tel" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                       placeholder="Phone Number Format: 123-456-7890" name="phone" className="form-control"/>
                            </div>


                            <div className="form-group submitbutton">
                                <button className="btn btn-danger" type="submit">
                                    Continue
                                </button>

                            </div>
                        </form>

                    </div>
                    {this.state.showShippingMethodStep &&
                    <div className="card-box">
                        <h4 className="m-t-0 header-title"><b>Shipping method</b></h4>

                        <p className="text-muted m-b-30 font-13">
                           Pick shipping option:
                        </p>
                        <div className="panel panel-default">
                        
                            <table className="table table-bordered">
                                {this.state.over && this.state.overWeight &&
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div className="radio">
                                                <label><input type="radio" id='regular' name="optradio"
                                                            className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "1"})}}/>
                                                    <strong>Everyday Free Shipping</strong>
                                                </label>
                                                <p className="tab">Transit time: 2 business days</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="price">                            
                                                <label htmlFor='free'>
                                                    <font color="red">FREE</font>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="radio">
                                                <label><input type="radio" id='express' name="optradio"
                                                            className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "2"})}}/>
                                                    <strong>Premium Shipping</strong>
                                                </label>   
                                                <p className="tab">Transit time: 1 business day</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="price">
                                                <label htmlFor='premium'>$25.00</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="radio">
                                                <label><input type="radio" id='express' name="optradio"
                                                            className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "3"});console.log("asdad")
                                                            }}/>
                                                    <strong>Pick up in our Warehouse</strong>
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="price">
                                                <label htmlFor='express'>
                                                    <font color="red">FREE</font></label>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                }

                                {this.state.over && this.state.underWeight &&
                                <tbody>
                                <tr>
                                    <td>
                                        <div className="radio">
                                            <label><input type="radio" id='regular' name="optradio"
                                                          className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "2"})}}/>
                                                <strong>Everyday Free Shipping by Drone</strong>
                                            </label>
                                            <p className="tab">Transit time: 1 business days</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="price">
                                            <label htmlFor='free'>
                                                <font color="red">FREE</font>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="radio">
                                            <label><input type="radio" id='express' name="optradio"
                                                          className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "3"});console.log("asdad")
                                            }}/>
                                                <strong>Pick up in our Warehouse</strong>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="price">
                                            <label htmlFor='express'>
                                                <font color="red">FREE</font></label>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                                }


                                {this.state.under &&
                                <tbody>

                                <tr>
                                    <td>
                                        <div className="radio">
                                            <label><input type="radio" id='regular' name="optradio"
                                                        className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "4"})}}/>
                                                <strong>Standard Shipping</strong>
                                                <p className="tab">Transit time: 2 business days</p>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="price">
                                            <label htmlFor='premium'>$20.00</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="radio">
                                            <label><input type="radio" id='express' name="optradio"
                                                        className="checkoutMargin" required disabled={this.state.shippingMethodDisable} onChange={()=>{this.setState({pickup: "3"})}}/>
                                                <strong>Pick up in our Warehouse</strong>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="price">
                                            <label htmlFor='express'>
                                                <font color="red">FREE</font></label>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                                }
                            </table>
                            
                        </div>
                        <div className="form-group submitbutton">
                                <button onClick={(event) => this.submitDelivery(event)} className="btn btn-danger" type="submit">
                                    Continue
                                </button>
                        </div>
                    </div>}


                    {this.state.showPaymentStep &&
                    <div className="card-box">
                        <form onSubmit={(event) => this.orderSubmit(event)}>
                        <h4 className="m-t-0 header-title"><b>Payment</b></h4>

                        <p className="text-muted m-b-30 font-13">
                            Enter payment information:
                        </p>

                        <div className="form-group">
                            <label htmlFor="cardtype">Card Type<span className="text-danger">*</span></label>
                            <Form>
                                <Form.Control as="select">
                                    <option>Visa</option>
                                    <option>MasterCard</option>
                                    <option>American Express</option>
                                    <option>Discovery</option>
                                </Form.Control>
                            </Form>
                        </div>



                        <div className="form-group">
                            <label htmlFor="cardnumber">Card Number (Twelve Digits)<span className="text-danger">*</span></label>
                            <input  type="text" pattern="\d{12}" required
                                    placeholder="Card Number" className="form-control"/>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="exp">Expiration Month<span className="text-danger">*</span></label>
                                <Form>
                                    <Form.Control as="select">
                                        <option>01</option>
                                        <option>02</option>
                                        <option>03</option>
                                        <option>04</option>
                                        <option>05</option>
                                        <option>06</option>
                                        <option>07</option>
                                        <option>08</option>
                                        <option>09</option>
                                        <option>10</option>
                                        <option>11</option>
                                        <option>12</option>
                                    </Form.Control>
                                </Form>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="exp">Year<span className="text-danger">*</span></label>
                                <Form>
                                    <Form.Control as="select">
                                        <option>2019</option>
                                        <option>2020</option>
                                        <option>2021</option>
                                        <option>2022</option>
                                        <option>2023</option>
                                        <option>2024</option>
                                        <option>2025</option>
                                        <option>2026</option>
                                        <option>2027</option>
                                        <option>2028</option>
                                    </Form.Control>
                                </Form>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="security">Security Number (Three digits)<span className="text-danger">*</span></label>
                            <input type="text" pattern="\d{3}" required
                                   placeholder="Security Number" className="form-control"/>
                        </div>


                        <h3 className="display-price">
                            Total:    <strong>${UserStoreService.getTotalPrice()}</strong>
                        </h3>

                        <div className="form-group submitbutton">
                            <input type='submit' name='Submit' value="Create My Account" className="btn btn-danger"/>
                        </div>
                        </form>

                    </div>
                    }

                </div>

        );
    }
}

export default Checkout;