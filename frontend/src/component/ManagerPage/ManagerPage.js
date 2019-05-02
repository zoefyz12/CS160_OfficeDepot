import React, {Component} from 'react';
import './ManagerPage.css'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "@material-ui/core/Modal/Modal";
import AddItem from "./AddItem/AddItem";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import logo from "../images/logo1.png";
import userService from "../../common/services/User/UserService";
import UserStoreService from "../../common/services/User/UserStoreService";

class ManagerPage extends Component {
    state = {

        open: false,
        scroll: 'body',

        nameData: [],
        allData: [],
        itemIds: [],


    };

    componentDidMount() {

        let itemIds = [];
        let itemId = null;
        this.setState({
            selectedMeun: document.getElementById('all')
        });
        userService.getAll().then((data) => {

            console.log(data);

            for(let i = 0; i < data.length; i++)
            {
                itemId = data[i].itemid;
                itemIds.push(itemId);
            }
            UserStoreService.setItemId(itemIds);
            UserStoreService.setAllItem(data);
            console.log(UserStoreService.getAllItem(),"all new item");


            this.setState({nameData: data, allData: UserStoreService.getAllItem(), itemIds: itemIds});
            console.log(this.state.allData, "ComponentDidmMount allData");
            console.log(this.state.nameData);
        }).catch((error) => {
            alert(error.message);
        });

        // fetch data from backend and assign all to displayCare
    }

    handleRemoveRow = (idx, delAmt) => {
        if(UserStoreService.getToken() !== undefined) {

            let datas = this.state.allData[idx];
            // console.log(UserStoreService.getAllItem(), "all Item list");
            // console.log(this.state.itemIds,"order item ids");
            // console.log(UserStoreService.getAllItem()[idx].itemid,"current delete item ids");
            let item = UserStoreService.getAllItem()[idx].itemid;

            let body = {
                authorization: UserStoreService.getToken(),
                itemid: item,
            };

            console.log("delAmt");
            userService.deleteItem(JSON.stringify(body)).then((data) => {

                console.log(data);
                alert("Delete Item Successfully!");
                this.setState({
                    allData: this.state.allData.filter(function (row) {
                        return row !== datas;
                    }),
                    itemIds: this.state.itemIds.filter(function (row) {
                        return row !== item;
                    }),
                });

                console.log(this.state.allData, "handleRemoveRow allData");
                // UserStoreService.setAllItem(this.state.allData);
                UserStoreService.setItemId(this.state.itemIds);
                UserStoreService.setAllItem(this.state.allData);
            }).catch((error) => {
                alert(error.message);
            });


        }
        else{
            alert("Please Sign in")
        }

    };
    handleOpen = scroll => () => {
        this.setState({open: true, scroll});
    };

    handleClose = () => {

        this.setState({open: false});
    };


    render() {
        return (
            <div>
                <div className="container">
                    <img className="rounded mx-auto d-block Mlogo" src={logo}/>
                    <Navbar bg="white" variant="light">
                        <Nav className="float-right">
                            <Nav.Link >Hi, Manager</Nav.Link>
                            <Nav.Link onClick={this.handleOpen('body')}>Add Item</Nav.Link>
                            <Nav.Link onClick={() => {this.props.history.push('/')}}>Main Page</Nav.Link>
                        </Nav>
                    </Navbar>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        scroll={this.state.scroll}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="simple-modal-description"
                    >
                        <DialogContent>

                        <AddItem closeModal={this.handleClose}/>
                        </DialogContent>
                    </Dialog>
                    <div className="row clearfix">
                        <div className="col-md-12 column">
                            <table
                                className="table table-bordered table-hover"
                                id="tab_logic"
                            >
                                <thead>
                                <tr>
                                    <th className="text-center itemNum"> ID </th>
                                    <th className="itemName"> Name </th>
                                    <th className="text-center itemPic"> Picture </th>
                                    <th className="text-center itemDelete"> Delete </th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.allData.map((item, idx) => (
                                    <tr id="addr0" key={idx}>
                                        <td className="cell">
                                            {item.itemid}
                                        </td>
                                        <td> 
                                            {item.name}
                                        </td>
                                        <td className="cell">
                                            <img className="rounded managerpicsize" src= {item.url} />
                                        </td>
                                        <td className="cell">            
                                            <button onClick={() => {this.handleRemoveRow(idx);}} className="btn btn-lg mx-auto">
                                                <span className="glyphicon glyphicon-trash"> </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManagerPage;