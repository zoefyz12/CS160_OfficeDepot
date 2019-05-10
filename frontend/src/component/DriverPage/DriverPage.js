import React, {Component} from 'react';
import logo from "../images/logo1.png";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import './DriverPage.css'
import GoogleMap from "./GoogleMap/GoogleMap";
import userService from "../../common/services/User/UserService";
import UserStoreService from "../../common/services/User/UserStoreService";

class DriverPage extends Component {


    state = {
        clicked: false,
        start: true,
        orders: [],
        addresses: [],
        open: false,
        driverOrderIds: [],
        wareHouseId: null,
    };

    componentDidMount() {

        let body = {
            authorization: UserStoreService.getToken()
        };
        let order = "";
        let orders = [];
        let address = "";
        let addresses = [];
        let driverOrderId = "";
        let driverOrderIds = [];
        userService.getShipAddress(JSON.stringify(body)).then((data) => {

            console.log(data,"data");
            console.log(UserStoreService.getToken());
            for (let i = 0; i < data.length; i++){
                address = data[i].shipadd;
                addresses.push(address);
                driverOrderId = data[i].orderid;
                driverOrderIds.push(driverOrderId);
                order = data[i].orderid;
                orders.push(order);
            }
            console.log("orders",orders);

           this.setState({addresses: addresses, driverOrderIds: driverOrderIds, orders: orders, wareHouseId: data[0].warehouseid})

        }).catch((error) => {
            alert(error.message);
        });

        // fetch data from backend and assign all to displayCare
    }



clickHandler = (event,props) =>{
    event.preventDefault();
        if(this.state.driverOrderIds[0] === undefined)
        {
            alert("Sorry, we don't have orders need to be delivered")
            this.setState({start: true, clicked: false})
            props.history.push('/')

        }

        else {
            this.setState({start: false, clicked: true})
        }
    };


    deliverySubmit = (event,props) => {
        event.preventDefault();
        let body = {
            authorization: UserStoreService.getToken(),
            orderids: this.state.driverOrderIds,
        };

        if(this.state.driverOrderIds[0] !== undefined) {
            userService.markDelivered(JSON.stringify(body)).then((data) => {

                console.log(data, "data");
                alert("Thanks for your delivery");
                props.history.push('/')

            }).catch((error) => {
                alert(error.message);
            });

        }
    };

    render() {
        return (
            <div>
                <img className="rounded mx-auto d-block logo" src={logo}/>
                <Navbar bg="white" variant="light">
                    <Nav className="float-right">
                        <Nav.Link>Hi, Driver</Nav.Link>
                        <Nav.Link onClick={() => {this.props.history.push('/')}}>Main Page</Nav.Link>
                    </Nav>
                </Navbar>
                <div className="Dbutton" id="start">
                     
                    {/* Click Start Delivery Button */}
                    {this.state.start &&
                    <button onClick={(event) => this.clickHandler(event,this.props)} className="btn btn-danger">
                        Start Delivery
                    </button>}

                    {/* Display Address Table */}
                    {this.state.clicked &&
                    <div className="container">
                        <button className="btn btn-danger btn-finish" onClick={(event) => this.deliverySubmit(event,this.props)}>
                            End Delivery
                        </button>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="text-center">Order Number</th>
                                    <th className="text-center">Address</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {this.state.addresses.map((item, idx) => (
                                    <tr id="addr0" key={idx}>
                                        <td>
                                            {this.state.orders[idx]}
                                        </td>
                                        <td>
                                            {this.state.addresses[idx]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>}

                    {/* Display Map and Directions */}                   
                    {this.state.clicked &&
                    <div className="inline">
                        <GoogleMap wareHouseId = {this.state.wareHouseId} addresses = {this.state.addresses} />
                    </div>
                    }                            
                </div>             
            </div>
        );
    };
}

export default DriverPage;