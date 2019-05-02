import React, {Component} from 'react';
import "./Login.scss";
import userService from './../../../common/services/User/UserService';
import userStoreService from './../../../common/services/User/UserStoreService';
import {Redirect} from "react-router";



class Login extends React.Component  {

    handleSubmit = (event,closeModal) => {
        event.preventDefault();
        let body = {
            email: event.target.email.value,
            password: event.target.psw.value
        };

        userService.userLogin(JSON.stringify(body)).then((data) => {
            userStoreService.setUser(data);
            userStoreService.setToken(data.token);
            userStoreService.setUserId(data.userid);
            userStoreService.setUserName(data.firstname);
            userStoreService.setUserEmail(data.email);
            userStoreService.setUserLevel(data.level);
            console.log(this.props,"outer");
            console.log(data.level,"level", this.props)
            if(data.level === 2)
            {

                this.props.parentData.history.push('/manager')
            }
            if(data.level === 3)
            {
                this.props.parentData.history.push('/driver')
            }

            console.log(data, this.props);

            closeModal(true);
        }).catch((error) => {
            alert(error.message);
        });

    };
    render(){
    console.log(this.props,"innner")
    return (
        <div>
            <div className="loginbox">
                <h1 className>Login</h1>
                <h6>Please enter your e-mail and password:</h6>
                <form onSubmit={(event) => this.handleSubmit(event,this.props.closeModal)}>
                    <div className="inner-icon left-addon">
                        <span className="glyphicon glyphicon-user"/>
                        <input type="email" name="email" placeholder="Email" required/>
                    </div>
                    <div className="inner-icon left-addon">
                        <span className="glyphicon glyphicon-lock"/>
                        <input type="password" name="psw" placeholder="Password" required/>
                    </div>
                    <input type="submit" name="" value="Login"/>

                    <a href="/register">Don't have an account? Signup here</a>
                </form>
            </div>

        </div>


    );}
};

export default Login;
