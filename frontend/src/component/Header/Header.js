import React, {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../images/logo1.png"
import "./Header.css"
import Modal from '@material-ui/core/Modal';
import Login from '../Authentication/Login/Login';
import Card from './Card/Card';
import userService from "../../common/services/User/UserService";
import userStoreService from "../../common/services/User/UserStoreService";



class Header extends Component {



    constructor(props) {
        super(props);

    }


    state = {
        userStatus: userStoreService.isLoggedin()? 'User Profile': 'Login',
        nameData: [],
        allData:[],
        open: false,
        selectedMeun: null,
    };


    // showDisplayCare = () => {
    //         userService.getAll().then((data) => {
    //             userStoreService.setUser(data);
    //             console.log(data);
    //             alert('Register Succeed')
    //         }).catch((error) => {
    //             alert(error.message);
    //         });
    //         props.history.push('/')
    //
    // };

    componentDidMount() {

        this.setState({
            selectedMeun: document.getElementById('all')
        });
        userService.getAll().then((data) => {

            console.log(data);
            this.setState({nameData: data, allData: data});
            console.log(this.state.nameData);
        }).catch((error) => {
            alert(error.message);
        });



        // fetch data from backend and assign all to displayCare
        // cookie.save(userStoreService.isLoggedin(), true, {path: '/'});
    }

    handleOpen = () => {
        if (this.state.userStatus === 'Login') {
            this.setState({open: true});
        } else {
            this.props.history.push('/userprofile')
            console.log(this.props.history,"prop history")
        }

    };

    handleClose = (login = false) => {

        let userStatus = 'Login';
        if (login) {
            userStatus = 'User Profile';
        }
        this.setState({
            userStatus,
            open: false
        });
    };

    meunHandler = (care, element) => {
        let allData = this.state.allData;
        let nameData =[];

        if (this.state.selectedMeun !== null) {
            this.state.selectedMeun.className = '';
        }

        switch (care) {
            case 'ink': {
                console.log(this.state.nameData);
                nameData = allData.filter(function (ink) {
                    return ink.category === "ink & toner";
                });
                console.log(nameData);
                break;
            }

            case 'paper': {
                nameData = allData.filter(function (paper) {
                    return paper.category === "paper";
                });
                console.log(nameData);
                break;
            }
            case 'office': {
                nameData = allData.filter(function (office) {
                    return office.category === "office supplies";
                });
                console.log(nameData);
                break;
            }
            case 'school': {
                nameData = allData.filter(function (school) {
                    return school.category === "school supplies";
                });
                console.log(nameData);
                break;
            }
            case 'elec': {
                nameData = allData.filter(function (elec) {
                    return elec.category === "electronic";
                });
                console.log(nameData);
                break;
            }
            case 'furn': {
                nameData = allData.filter(function (furn) {
                    return furn.category === "furniture";
                });
                console.log(nameData);
                break;
            }
            case 'clean': {
                nameData = allData.filter(function (clean) {
                    return clean.category === "cleaning";
                });
                console.log(nameData);
                break;
            }

            case 'all': {
                nameData = allData;
            }
        }

        element.target.className = 'active';
        this.setState({
            selectedMeun: element.target,
            nameData: nameData
        })
    };

    render() {

        return (
            <div cookies={this.props.cookies}>

                <img className="rounded mx-auto d-block logo" src={logo}/>

                <Navbar bg="white" variant="light">
                    <Nav className="float-right">
                        <Nav.Link onClick={this.handleOpen}>{this.state.userStatus}</Nav.Link>
                        <Nav.Link onClick={() => {this.props.history.push('/cart')}}>Shopping Cart</Nav.Link>
                        {(this.state.userStatus === "User Profile") &&
                        <Nav.Link href="/">Log out</Nav.Link>}


                    </Nav>
                </Navbar>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={() => this.handleClose(false)}
                >
                    <Login closeModal={this.handleClose} parentData={this.props}/>
                </Modal>


                <div className="vertical-menu">

                    <a id='all' className='active' onClick={(event) => {
                        this.meunHandler('all', event)
                    }}>View All</a>
                    <a onClick={(event) => {
                        this.meunHandler('ink', event)
                    }}>Ink & Toner</a>
                    <a onClick={(event) => {
                        this.meunHandler('paper', event)
                    }}>Paper & Stationery</a>
                    <a onClick={(event) => {
                        this.meunHandler('office', event)
                    }}>Office Supplies</a>
                    <a onClick={(event) => {
                        this.meunHandler('school', event)
                    }}>School Supplies</a>
                    <a onClick={(event) => {
                        this.meunHandler('elec', event)
                    }}>Electronics</a>
                    <a onClick={(event) => {
                        this.meunHandler('furn', event)
                    }}>Furniture</a>
                    <a onClick={(event) => {
                        this.meunHandler('clean', event)
                    }}>Cleaning & Facilities</a>
                </div>

                <div className='cardBox'>
                    {
                        this.state.nameData.map((val, index) => {
                            return (
                                <Card cardName={val.name} cardUrl={val.url} cardId={val.itemid} cardPrice={val.price} key={index}/>
                            )
                        })
                    }
                </div>

            </div>);
    }
}

export default Header;