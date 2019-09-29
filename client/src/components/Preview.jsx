import React, { Component } from "react";
import { Container, Row, Col, Label, Button, Input } from "reactstrap";
import Iframe from "react-iframe";
import { Redirect } from "react-router";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Clerk from "./clerk";
import axios from "axios";

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackSent: false,

      message: "Document successfully filed!",
      fileId: this.props.location.state.fileId,
      dateFiled: this.props.location.state.preDateFiled,
      submittedBy: this.props.location.state.preSubmittedBy,
      nav: false,
      docType: "",
      docTitle: "",
      documentFiled: false,
      tonyData: [
        {
          applicant: "Tony Rocks",
          duedate: "Sept 6 2019",
          id: "FS-19-111111",
          sub_files: [
            {
              pending_docs: [
                {
                  enc_doc_name: "check"
                }
              ]
            }
          ]
        }
      ]
    };
    this.handleDataDelete = this.handleDataDelete.bind(this);
    this.handleFileApprove = this.handleFileApprove.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.value === "MIP") {
      this.setState({
        docTitle: "MIP Certificate"
      });
    } else if (e.target.value === "TOC") {
      this.setState({
        docTitle: "Table of Contents"
      });
    } else if (e.target.value === "F8") {
      this.setState({
        docTitle: "Form 8: Application (General)"
      });
    } else if (e.target.value === "F6B") {
      this.setState({
        docTitle: "Form 6B: Affidavit of Service"
      });
    } else if (e.target.value === "F13.1") {
      this.setState({
        docTitle: "Form 13.1: Financial Statement"
      });
    } else if (e.target.value === "F35.1") {
      this.setState({
        docTitle: "Form 8: Affidavit of Support"
      });
    } else if (e.target.value === "F36") {
      this.setState({
        docTitle: "Form 36: Affidavit of Divorce"
      });
    } else if (e.target.value === "F13A") {
      this.setState({
        docTitle: "Form 8: Certificate of Finance"
      });
    } else if (e.target.value === "MC") {
      this.setState({
        docTitle: "Marriage Certificate"
      });
    }
  }

  updateDocTitle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleFileApprove = () => {
    var tempDate = new Date();
    var date =
      tempDate.getDate() +
      " " +
      (tempDate.getMonth() + 1) +
      " " +
      tempDate.getFullYear();

    var record_name = "sub_files.0.continuing_record";
    if (this.state.docTitle === "Table of Contents") {
      record_name = "sub_files.0.order_endorsements";
    } else if (this.state.docTitle === "Marriage Certificate") {
      record_name = "other_documents";
    }
    axios.post(
      "https://safe-fortress-44327.herokuapp.com/api/data/updateData",
      {
        fileid: this.props.location.state.courtFileNumber,
        subfileQuery: record_name,
        updateData: {
          document: this.state.docTitle,
          date_filed: this.state.dateFiled,
          submitted_by: this.state.submittedBy,
          enc_doc_name: this.state.fileId
        }
      }
    );

    this.handleDataDelete("accepted");
  };

  handleFileReject = () => {
    console.log("rejected state", this.state);

    var record_name = "rejected_docs";

    axios.post(
      "https://safe-fortress-44327.herokuapp.com/api/data/updateData",
      {
        fileid: this.props.location.state.courtFileNumber,
        subfileQuery: record_name,
        updateData: {
          document: this.state.docTitle,
          submitted_by: this.state.submittedBy,
          enc_doc_name: this.state.fileId
        }
      }
    );

    this.handleDataDelete("rejected");
  };

  handleDataDelete = value => {
    var tempDate = new Date();
    var date =
      tempDate.getDate() +
      " " +
      (tempDate.getMonth() + 1) +
      " " +
      tempDate.getFullYear();
    axios
      .post(
        "https://safe-fortress-44327.herokuapp.com/api/data/deleteFromPending",
        {
          fileid: this.props.location.state.courtFileNumber,
          subfileQuery: "sub_files.0.pending_docs",
          updateData: {
            document: this.state.docTitle,
            date_filed: this.state.dateFiled,
            submitted_by: this.state.submittedBy,
            enc_doc_name: this.state.fileId
          }
        }
      )
      .then(() => {
        fetch("https://safe-fortress-44327.herokuapp.com/api/data/getTonyData")
          .then(data => data.json())
          .then(res => {
            this.setState({ tonyData: res.data });
          })
          .then(res => {
            if (value === "rejected") {
              this.setState({ message: "Document rejection feedback sent" });
            } else {
              this.setState({ message: "Document successfully filed!" });
            }
            this.setState({ documentFiled: true });
          });
      });
  };

  handleFeedback = () => {
    this.setState({ feedbackSent: true });
  };

  handleNextDoc = value => {
    this.setState({
      feedbackSent: false,
      fileId: value.enc_doc_name,
      date_filed: value.date_filed,
      submitted_by: value.submitted_by,
      documentFiled: false,
      docType: "",
      docTitle: ""
    });
  };

  handleDashboard = () => {
    this.setState({ nav: true });
  };

  componentDidMount() {
    fetch("https://safe-fortress-44327.herokuapp.com/api/data/getTonyData")
      .then(data => data.json())
      .then(res => {
        this.setState({ tonyData: res.data });
      });
  }
  render() {
    const { fileId } = this.props.location.state;
    const { nav, docTitle } = this.state;

    if (nav) {
      return (
        <Router>
          <Redirect
            to={{
              pathname: "/clerk"
            }}
          />
          <Route path="/clerk" component={Clerk} />
        </Router>
      );
    }
    return (
      <Container>
        <Row xs="11">
          <Iframe
            url={
              `https://safe-fortress-44327.herokuapp.com/read/` +
              this.state.fileId
            }
            className="preview"
            width="100%"
            // height="1200px"
          />
        </Row>
        {this.state.documentFiled === false && (
          <Row className="mt-5">
            <Col xs="4" style={{ marginTop: "1.9rem" }}>
              {/* <Button
                onClick={() => this.handleDataDelete("rejected")}
                className="btn btn-danger btn-block"
              > */}
              <Button
                onClick={() => this.handleFileReject()}
                className="btn btn-danger btn-block"
              >
                Reject submission
              </Button>
            </Col>
            <Col xs="4">
              <Row>
                <Col xs="4">
                  <Label for="docType">Doc code</Label>
                  <Input
                    type="text"
                    name="docType"
                    id="docType"
                    onChange={this.onChange}
                  />
                </Col>
                <Col xs="8">
                  <Label for="docTitle">Doc Title</Label>
                  <Input
                    type="text"
                    name="docTitle"
                    id="docTitle"
                    value={docTitle}
                    onChange={this.updateDocTitle}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs="4" style={{ marginTop: "1.9rem" }}>
              <Button onClick={() => this.handleFileApprove()}>
                File Document
              </Button>
            </Col>
          </Row>
        )}
        {this.state.documentFiled && (
          <React.Fragment>
            <Container className="success-message-padding ">
              {this.state.message === "Document successfully filed!" ? (
                <Row className="half-padding">
                  <Col xs={3} className="success-dark-green">
                    <img
                      src="./dfl/success.png"
                      className="success-image-clerk half-top-margin "
                    />
                  </Col>
                  <Col xs={9} className="success-light-green">
                    <Container>
                      <Row className="half-top-margin">
                        {this.state.message}
                      </Row>
                    </Container>
                  </Col>
                </Row>
              ) : (
                this.state.feedbackSent === false && (
                  <React.Fragment>
                    <Row>Describe reason(s) for rejection to the client</Row>
                    <Row>
                      <Col xs={8}>
                        <input type="text" className="full-width" />
                      </Col>

                      <Button onClick={this.handleFeedback}>
                        Send feedback
                      </Button>
                    </Row>
                  </React.Fragment>
                )
              )}
            </Container>
            {this.state.feedbackSent && (
              <Container className="success-message-padding ">
                <Row>
                  <Col xs={3} className="success-dark-green">
                    <img
                      src="./dfl/success.png"
                      className="success-image-clerk"
                    />
                  </Col>
                  <Col xs={9} className="success-light-green">
                    <Container>
                      <Row>{this.state.message}</Row>
                    </Container>
                  </Col>
                </Row>
              </Container>
            )}
          </React.Fragment>
        )}
        <div className="padding-top-two" />
        <Row className="grey-bg-color  ">
          <Col xs={8}>
            {this.state.tonyData[0].sub_files[0].pending_docs.length > 1 && (
              <div>
                {this.state.tonyData[0].sub_files[0].pending_docs.length} more
                documents requiring review
              </div>
            )}
            {this.state.tonyData[0].sub_files[0].pending_docs.length <= 1 && (
              <div>Last document requiring review</div>
            )}
          </Col>
          {this.state.documentFiled &&
            this.state.tonyData[0].sub_files[0].pending_docs.length === 0 && (
              <Col xs={4}>
                <Row>
                  <Button
                    className="blue-color"
                    onClick={() => this.handleDashboard()}
                  >
                    Back To Dashboard
                  </Button>
                  <div className="width-two" />
                  <Button>Go to court file</Button>
                </Row>
              </Col>
            )}
          {this.state.documentFiled &&
            this.state.tonyData[0].sub_files[0].pending_docs.length > 0 && (
              <Col xs={3}>
                <Button
                  className="blue-color"
                  onClick={() =>
                    this.handleNextDoc(
                      this.state.tonyData[0].sub_files[0].pending_docs[0]
                    )
                  }
                >
                  Next Document
                </Button>
              </Col>
            )}
        </Row>

        <Row className="six-heigth" />
      </Container>
    );
  }
}

export default Preview;
