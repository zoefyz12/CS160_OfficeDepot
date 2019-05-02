import React from 'react';
import "./Register.css";
import userService from "../../../common/services/User/UserService";
import userStoreService from "../../../common/services/User/UserStoreService";
import logo from "../../images/logo1.png";



class Register extends React.Component {


    handleSubmit = (event,props) => {
        event.preventDefault();
    let body = {
        firstname: event.target.fname.value,
        lastname: event.target.lname.value,
        email: event.target.email.value,
        password: event.target.password.value,
    };


    if (body.password === event.target.cPassword.value) {
        userService.userRegister(JSON.stringify(body)).then((data) => {
           // console.log(data);
            console.log(props,"myprops")
            alert('Register Succeed')
            props.history.push('/')
        }).catch((error) => {
            alert(error.message);
        });


    } else {
        alert('Sorry, the passwords are not same.')
    }

    };

    render() {
        return (
            
                <div className="container">
                    <div className="register-header">
                        <img className="rounded mx-auto d-block" src={logo}/>
                    </div>

                    <div className="register-box">
                        <h2>New User Information</h2>
                        <h6>Please fill in the information below: </h6>

                        <form onSubmit={(event) => this.handleSubmit(event,this.props)}>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name<span className="text-danger">*</span></label>
                                <input type="text" name="fname" required
                                    placeholder="First Name" className="form-control" id="fname"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name<span className="text-danger">*</span></label>
                                <input type="text" name="lname" required
                                    placeholder="Last Name" className="form-control" id="lname"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="emailAddress">Email<span className="text-danger">*</span></label>
                                <input type="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    placeholder="Email" className="form-control" id="email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pass1">Password<span className="text-danger">*</span></label>
                                <input type="password" name="password" required
                                    placeholder="Password" className="form-control" id="password"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="passWord2">Confirm Password <span className="text-danger">*</span></label>
                                <input type="password" required name='cPassword'
                                    placeholder="Password" className="form-control" id="cPassword"/>
                            </div>



                            <div className="form-group submitbutton">
                                <input type='submit' name='Submit' value="Create My Account" className="btn btn-danger"/>
                            </div>
                        </form>
                    </div>
                    
                
            </div>);
    };

}

export default Register;