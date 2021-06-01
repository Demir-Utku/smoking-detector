import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./Main.css";
import Images from "../Images";
import About from "../About";
import Loader from "../Loader";

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      length: {},
    };
  }

  componentDidMount = async () => {
    await fetch("/api/length")
      .then((res) => res.json())
      .then((length) => this.setState({ length: length.number }));
  };

  render() {
    return (
      <Router>
        <div>
          <header className={`header ${this.props.inline ? this.props.inline + "-header" : ""}`}>
            <button className="homelink"><Link className="home" to="/">HOME</Link></button>
            <button className="aboutlink"><Link className="about" to="/about">ABOUT</Link></button>
          </header>
          
          <Switch>
            <Route className="Exact" exact path="/">
              <Loader
                className="Spinner"
                type="Oval"
                width={200}
                timeout={2000}
              />
              <Images wait={2000} length={200} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
