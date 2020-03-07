import React from 'react';
import logo from './logo.png';
import './App.css';
import Login from './form';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to BankCo</p>
        <Link to="/login">
          <button className="button" type="text">
            Login
          </button>
        </Link>
      </header>
    </div>
  );
}

function About() {
  return (
    <div className="App">
      <p>
        about
        </p>
      <button>
        <Link to="/login" />
      </button>
    </div >
  );
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}
