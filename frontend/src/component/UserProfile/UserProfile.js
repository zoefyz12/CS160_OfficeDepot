import React, {Component} from 'react';
import logo from "../images/logo1.png";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import userService from "../../common/services/User/UserService";
import UserStoreService from "../../common/services/User/UserStoreService";
import HistoryBox from "./HistoryBox/HistoryBox";
import Card from "../Header/Card/Card";

class UserProfile extends Component {
    state = {
        name: 'Zoe Zhao',
        email: 'zoefyz12@gmail.com',
        orderId: '000001',
        orderStatus: 'Shipped',
        date: '04/08/2019',
        totalPrice: '$103.46',
        ordername: ['Boise POLARIS® Premium Multipurpose Paper, Letter Paper Size, FSC® Certified, White, 500 Sheets Per Ream, Case Of 10 Reams',
            'Realspace® Magellan Performance Collection L-Shaped Desk, Espresso Realspace® Magellan Performance Collection L-Shaped Desk, Espresso',
            'Lenovo® IdeaPad™ 530S Laptop, 14" Screen, AMD Ryzen™ 5, 8GB Memory, 256GB Solid State Drive, Windows® 10 Home'],
        pic: ['https://officedepot.scene7.com/is/image/officedepot/196697_p_boise_polaris_premium_multipurpose_paper?$OD-Med$',
            'https://officedepot.scene7.com/is/image/officedepot/956652_p_realspace_magellan_performance_collection_l_desk?$OD-Med$',
            'https://officedepot.scene7.com/is/image/officedepot/2553990_o01_lenovo_ideapad_530s_laptop?$OD-Med$'],
        rows: ['1','1','1'],
        price:['$90','$1990','$370'],

        orderHistory: [],

    };

    componentDidMount() {

        let body = {
            authorization: UserStoreService.getToken(),
            userid: UserStoreService.getUserId(),
        };
        console.log(body.authorization, "token")
        userService.getOrderHistory(JSON.stringify(body)).then((data) => {
            console.log(data);

            this.setState({orderHistory: data});
           console.log(this.state.orderHistory,"orderHistory")
        }).catch((error) => {
            alert(error.message);
        });

        // fetch data from backend and assign all to displayCare
    }

    render() {
        return (


            <div className="container">
                <img className="rounded mx-auto d-block Mlogo" src={logo}/>
                <Navbar variant="light">
                    <Nav className="float-right">
                        <Nav.Link >Hi, {UserStoreService.getUserName()}</Nav.Link>
                        <Nav.Link onClick={() => {this.props.history.push('/')}}>Main Page</Nav.Link>
                    </Nav>
                </Navbar>

                <div className="card-box">
                    <h4 className="header-title"><b>User Information</b></h4>
                    <p className="font-14">
                        Name: {UserStoreService.getUserName()}
                    </p>
                    <p className="font-14">
                        Email: {UserStoreService.getUserEmail()}
                    </p>
                </div>

                <div className="card-box">
                    <h4 className="m-t-0 header-title"><b>Order History</b></h4>
                    {
                        this.state.orderHistory.map((val, index) => {
                            return (
                                <HistoryBox orderId={val.orderid} status={val.status} orderDate={val.orderdate}
                                            totalPrice={val.totalprice} key={index}/>
                            )
                        })
                    }
                </div>
            </div>


        );
    }
}

export default UserProfile;