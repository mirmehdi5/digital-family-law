import React, { Component } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import GeneralUser from "./generalUser";
import AccessPin from "./accesPin";
import Lawyer from "./lawyer";
import Clerk from "./clerk";
import Header from "./header";
import axios from "axios";
import HomeCards from "./homeCards";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      homeclicked: "login",
      userType: {},
      email: "",
      password: "",
      hidePage: false,
      showOrHide: true,
      username: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleEmptyTony = () => {
    axios.post(
      "https://safe-fortress-44327.herokuapp.com/api/data/deleteTonyData",
      {
        fileid: "FS-19-111111"
      }
    );
  };
  onSubmit(e) {
    const { email, password } = this.state;
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/userlogin/" +
        email +
        "/" +
        password
    )
      .then(data => data.json())
      .then(res => {
        if (res.data === null) {
          alert("Invalid credentials");
        } else {
          this.setState({
            userType: res.data.type,
            username: res.data.username
          });
        }
      });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleShowOrHide = () => {
    this.setState({
      showOrHide: false
    });
  };
  handlePageHide = () => {
    this.setState({
      hidePage: true
    });
  };
  handleLogoClick = () => {
    this.setState({
      homeclicked: "cards"
    });
  };
  handleCardClick = () => {
    this.setState({
      homeclicked: "login"
    });
  };

  render() {
    const pageStyle = this.state.hidePage ? { display: "none" } : {};
    const style = this.state.showOrHide ? { display: "none" } : {};

    if (this.state.homeclicked === "login") {
      if (this.state.userType === "general") {
        return (
          <React.Fragment>
            <div style={pageStyle}>
              <Header
                userName={this.state.username}
                onLogoClick={this.handleLogoClick}
              />
              <Container>
                <AccessPin
                  onShowOrHide={this.handleShowOrHide}
                  userName={this.state.username}
                  onPageHide={this.handlePageHide}
                />
              </Container>
            </div>
          </React.Fragment>
        );
      } else if (this.state.userType === "lawyer") {
        return (
          <React.Fragment>
            <div>
              <Header
                userName={this.state.username}
                onLogoClick={this.handleLogoClick}
              />
            </div>
            <Container>
              <Lawyer
                onPageHide={this.handlePageHide}
                userName={this.state.username}
              />
            </Container>
          </React.Fragment>
        );
      } else if (this.state.userType === "clerk") {
        return (
          <React.Fragment>
            <div>
              <Header
                userName={this.state.username}
                onLogoClick={this.handleLogoClick}
              />
            </div>
            <Container>
              <Clerk
                onPageHide={this.handlePageHide}
                userName={this.state.username}
              />
            </Container>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <Header
              userName={this.state.username}
              onLogoClick={this.handleLogoClick}
            />
            <Container>
              <Col xs={3}>
                <Row className="padding-top-three">
                  <h3>Log in</h3>
                </Row>
                <Form className="padding-top-three">
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      id="email"
                      onChange={this.onChange}
                      className="mb-3"
                    />
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      id="password"
                      onChange={this.onChange}
                      className="mb-3"
                    />
                    <a href="#">I forgot my password.</a>

                    <Button
                      color="dark"
                      style={{ marginTop: "2rem", width: "8rem" }}
                      block
                      onClick={this.onSubmit}
                    >
                      Sign in
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </Container>
            <Row className="top-margin-fifteen">
              <Col xs={11} />
              <Col
                xs={1}
                onClick={this.handleEmptyTony}
                className="anchor-color"
              >
                Reset
              </Col>
            </Row>
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          <Header
            userName={this.state.username}
            onLogoClick={this.handleLogoClick}
          />
          <HomeCards onCardClick={this.handleCardClick} />
        </React.Fragment>
      );
    }
  }
}

export default Login;
