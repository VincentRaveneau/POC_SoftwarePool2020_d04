import React, { Component } from 'react';
import './App.css';

class Login extends Component {
  state = {
    Email: null,
    Password: null
  };

  change = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  submit = e => {
    e.preventDefault();
    console.log(this.state);
  };
  render() {
    return (
      <div>
        <form onSubmit={this.submit}>
          <label htmlFor="Email">Email</label>
          <input type="text" id="Email" onChange={this.change} />
          <label htmlFor="Password">Password</label>
          <input type="text" id="Password" onChange={this.change} />
        </form>
      </div>
    );
  }
}

export default Login;