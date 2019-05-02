import React from 'react';
import "./LoginTest.scss";
import ApiService from "./../../../common/services/ApiService";

class LoginTest extends React.Component {
	constructor() {
		super();

	}

	loginSubmit(event) {
		event.preventDefault();
		const form = event.target;

		const data = {
			'email': form.email.value,
			'password': form.password.value
		};


		var response = ApiService.login(data);

		response.then(result=>{
			// Your codes start here
			// Do whatever you want with the result JSON type. For example: print out the result:
			console.log(result);
			console.log(result.firstname);
			console.log(result.userid);
		});
	}


	render() {
		return (
			<div>
            	<div className= "loginbox">
                	<h1>Welcome</h1>
                	<form onSubmit={this.loginSubmit}>
                    	<div className="inner-icon left-addon">
                        	<span className="glyphicon glyphicon-user" />
                        	<input type="text" placeholder="Enter Username" name="email" /*value={this.state.email} onChange={this.emailChange}*/ required />
                    	</div>
                    	<div className="inner-icon left-addon">
                        	<span className="glyphicon glyphicon-lock" />
                    		<input type="password" /*ref="password"*/ placeholder="Enter Password" name="password" /*value={this.state.password} onChange={this.passwordChange}*/ required />
            			</div>
            			<input type="submit" name="" value="Login" />
                    	<a href="#">Don't have an account? </a>
            		</form>
        		</div>
        	</div>
		);
	}
}

export default LoginTest;
