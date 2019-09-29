import React, { Component } from "react";
import Home from "./home";

class GeneralUser extends Component {
  state = {
    data: [
      {
        linked: "no"
      }
    ]
  };

  componentDidMount() {
    this.handleDataFetch();
  }
  render() {
    return (
      <React.Fragment>
        {this.state.data[0].linked === "yes" && (
          <Home
            courtData={this.state.data}
            onCardClick={this.handleCardCLick}
            userName={this.props.userName}
            userType="general"
          />
        )}
      </React.Fragment>
    );
  }
  handleCardCLick = () => {
    this.props.onPageHide();
  };
  handleDataFetch = () => {
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/getData?name=" +
        this.props.userName
    )
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };
}

export default GeneralUser;
