import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Login from "./components/login";
import FileUploader from "./components/FileUploader";
import Preview from "./components/Preview";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  state = {
    showOrHide: true,
    hidePage: false
  };

  render() {
    const style = this.state.showOrHide ? { display: "none" } : {};
    const pageStyle = this.state.hidePage ? { display: "none" } : {};
    return <Login />;
  }
}

export default App;
