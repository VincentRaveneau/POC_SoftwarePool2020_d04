import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/login" component={About} />
          <Route path="/user" component={User} />
          <Route path="/" component={home} />
          <Route path="/home" component={Home} />
        </Switch>
    </Router>
  );
}