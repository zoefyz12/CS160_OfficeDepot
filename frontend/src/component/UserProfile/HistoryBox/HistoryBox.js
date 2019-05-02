import React, {Component} from 'react';
import "./HistoryBox.css"
import UserStoreService from "../../../common/services/User/UserStoreService";
import userService from "../../../common/services/User/UserService";


class HistoryBox extends Component {

    state = {

        orderHistoryDetail: [],

    };


    componentDidMount() {

        let body = {
            authorization: UserStoreService.getToken(),
            orderid: this.props.orderId,
        };
        console.log(body.authorization, "token")
        userService.getOrderHistoryDetail(JSON.stringify(body)).then((data) => {
            console.log(data);

            this.setState({orderHistoryDetail: data});
            console.log(this.state.orderHistoryDetail,"orderHistory")
        }).catch((error) => {
            alert(error.message);
        });

    }

    render() {
        return (
            <div className="order-box">
                <div className="m-b-30 font-15">
                    <strong>Order ID: {this.props.orderId}</strong>
                </div>
                <div className="m-b-30 font-13">
                    Status: {this.props.status}
                </div>
                <div className="m-b-30 font-13">
                    Date: {this.props.orderDate}
                </div>
                

                <div className="row clearfix">
                    <div className="col-md-12 column">
                        <table className="table table-bordered table-hover" id="tab_logic">
                            <thead>
                                <tr>
                                    <th> Picture </th>
                                    <th> Name </th>
                                    <th> Price </th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.orderHistoryDetail.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                
                                    <td>
                                        <img className="rounded managerpicsize" src= {item.url} />
                                    </td>
                                    <td>
                                        {item.name}
                                    </td>                   
                                    <td className="text-center">
                                        ${item.price}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="font-13">
                    Total Price: ${this.props.totalPrice}
                </div>
            </div>
            )

    };
}
export default HistoryBox;