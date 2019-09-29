import React, { Component } from "react";
import "react-table/react-table.css";
import "../app.css";
import { Container, Row, Col } from "react-bootstrap";
import FileUploader from "./FileUploader";
import GeneralFileUploader from "./generalFileUploader";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MaterialIcon from "material-icons-react";

class SubCase extends Component {
  constructor(props) {
    super(props);
  }

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (id, position, applicant, encodedDocName, filename) => {
    var tempDate = new Date();
    var rdate = "";
    var date =
      tempDate.getDate() +
      " " +
      (tempDate.getMonth() + 1) +
      " " +
      tempDate.getFullYear();
    var recordTable = "";
    if (this.props.userType === "clerk") {
      if (filename === "Table of Contents") {
        recordTable = ".order_endorsements";
        applicant = "-";
        date = "-";
      } else {
        recordTable = ".continuing_record";
        if (filename === "Form 8: Application (General)") {
          date = "August 1 2019";
        }
      }
    } else {
      recordTable = ".pending_docs";
      if (filename === "form_6b.pdf") {
        date = "August 9 2019";
        rdate = "August 11 2019";
      } else if (filename === "form_13.1.pdf") {
        date = "August 9 2019";
        rdate = "August 11 2019";
      } else if (filename === "form_36.pdf") {
        date = "August 9 2019";
        rdate = "August 11 2019";
      } else if (filename === "form_35.1.pdf") {
        date = "August 20 2019";
        rdate = "August 22 2019";
      } else if (filename === "MARRIAGE CERTIFICATE.pdf") {
        date = "August 9 2019";
        rdate = "August 11 2019";
      } else if (filename === "MIP CERTIFICATE.pdf") {
        date = "August 20 2019";
        rdate = "August 22 2019";
      } else if (filename === "form_13a.pdf") {
        date = "August 20 2019";
        rdate = "August 22 2019";
      }
    }

    if (this.props.userType === "lawyer") {
      applicant = "Maria Law";
    }

    if (applicant === "Maria Law") {
      applicant += "(R)";
    } else if (applicant === "Tony Rocks") {
      applicant += "(A)";
    }
    axios
      .post("https://safe-fortress-44327.herokuapp.com/api/data/updateData", {
        fileid: id,
        subfileQuery: "sub_files." + position + recordTable,
        updateData: {
          document: filename,
          date_filed: date,
          submitted_by: applicant,
          enc_doc_name: encodedDocName,
          review_date: rdate
        }
      })
      .then(data => {
        this.props.onDocsUpload(position);
      });
  };

  state = {
    filename: ""
  };

  handleDelete = record => {
    axios
      .post(
        "https://safe-fortress-44327.herokuapp.com/api/data/deleteFromPending",
        {
          fileid: this.props.subFileData.id,
          subfileQuery: "sub_files.0.pending_docs",
          updateData: {
            enc_doc_name: record.enc_doc_name
          }
        }
      )
      .then(data => {
        this.props.onDocsUpload("0");
      });
  };

  render() {
    const {
      id,
      subFile,
      applicant,
      respondent,
      position
    } = this.props.subFileData;
    return (
      <React.Fragment>
        <Row className="padding-top-three">
          <h3>Parties involved</h3>
        </Row>
        <Row>
          <Col xs={3}>
            <Row>Applicant</Row>
            <Row>{applicant}</Row>
            <Row>Address</Row>
            <Row>City, ON X#X #X#</Row>
            <Row>###.###.####</Row>
            <Row>tony@gmail.com</Row>
          </Col>
          <Col xs={3}>
            <Row>Applicant's Lawyer on record</Row>
            <Row>{subFile.applicant_lawyer}</Row>
            <Row>Address</Row>
            <Row>City, ON X#X #X#</Row>
            <Row>###.###.####</Row>
            <Row>ehall@hallassociates.com</Row>
          </Col>
          <div className="vl" />
          <Col xs={3}>
            <Row>Respondent</Row>
            <Row>{respondent}</Row>
            <Row>Address</Row>
            <Row>City, ON X#X #X#</Row>
            <Row>###.###.####</Row>
            <Row>marialaw@gmail.com</Row>
          </Col>
          <Col xs={3}>
            <Row>Respondent's Lawyer on record</Row>
            <Row>{subFile.respondent_lawyer}</Row>
            <Row>Address</Row>
            <Row>City, ON X#X #X#</Row>
            <Row>###.###.####</Row>
            <Row>mkash@kashassociates.com</Row>
          </Col>
        </Row>

        <h2 className="padding-top-three">Documents</h2>
        <Row>
          <input
            className="search-bar"
            type="text"
            placeholder="Search for a document in this case by form name or number"
          />
        </Row>

        <Row className="padding-top-three">
          {this.props.userType === "clerk" ? (
            <FileUploader
              id={this.props.subFileData.id}
              position={this.props.subFileData.position}
              applicant={this.props.subFileData.applicant}
              respondent={this.props.subFileData.respondent}
              onUploadDB={this.updateDB}
            />
          ) : (
            <GeneralFileUploader
              id={this.props.subFileData.id}
              position={this.props.subFileData.position}
              applicant={this.props.subFileData.applicant}
              onUploadDB={this.updateDB}
            />
          )}
        </Row>
        {subFile.pending_docs <= 0 ? (
          ""
        ) : (
          <div className="padding-top-three">
            <h2>Documents you've submitted for court clerk review </h2>
            <Container className="solid-border">
              <Row className="table-header-pending-docs hide-borders padding-full-one ">
                <Col xs={1}>
                  <input type="checkbox" />
                </Col>

                <Col xs={1}>
                  <MaterialIcon icon="save_alt" color="#000000" />
                </Col>
                <Col xs={1}>
                  <MaterialIcon icon="print" color="#000000" />
                </Col>
              </Row>

              <Row className="hide-borders dark-font ">
                <Col xs={1} />
                <Col xs={3} className="right-border">
                  Form Title
                </Col>
                <Col xs={2} className="right-border">
                  Date Filed
                </Col>
                <Col xs={3} className="right-border">
                  Expected Review Date
                </Col>
                <Col xs={3}>Action</Col>
              </Row>

              {subFile.pending_docs.map(record => (
                <Row
                  key={record.document}
                  className="hide-borders padding-full-one"
                >
                  <Col xs={1}>
                    <input type="checkbox" />
                  </Col>
                  <Col xs={3}>{record.document}</Col>
                  <Col xs={2}>{record.date_filed}</Col>
                  <Col xs={3}>{record.review_date}</Col>
                  <Col xs={3}>
                    <Row className="zero-margin-left">
                      <a
                        className="anchor-color"
                        onClick={() => {
                          window.open(
                            "https://safe-fortress-44327.herokuapp.com/read/" +
                              record.enc_doc_name,
                            "_blank"
                          );
                        }}
                      >
                        View
                      </a>
                    </Row>
                    <Row className="zero-margin-left">
                      <a
                        className="anchor-color"
                        onClick={() => this.handleDelete(record)}
                      >
                        Delete
                      </a>
                    </Row>
                  </Col>
                </Row>
              ))}
              <Row className="table-header-pending-docs half-padding" />
            </Container>
          </div>
        )}
        {subFile.order_endorsements <= 0 ? (
          ""
        ) : (
          <div className="padding-top-three">
            <h2>Continuing record - endorsement volume</h2>
            <Container className="solid-border">
              <Row className="table-header-order-endorse hide-borders padding-full-one ">
                <Col xs={1}>
                  <input type="checkbox" />
                </Col>

                <Col xs={1}>
                  <MaterialIcon icon="save_alt" color="#000000" />
                </Col>
                <Col xs={1}>
                  <MaterialIcon icon="print" color="#000000" />
                </Col>
              </Row>

              <Row className="hide-borders dark-font ">
                <Col xs={1} />
                <Col xs={3} className="right-border">
                  Form Title
                </Col>

                <Col xs={3} className="right-border">
                  Judge
                </Col>
                <Col xs={2} className="right-border">
                  Date Signed
                </Col>
                <Col xs={3}>Action</Col>
              </Row>
              {subFile.order_endorsements.map(record => (
                <Row
                  key={record.document}
                  className="hide-borders padding-full-one"
                >
                  <Col xs={1}>
                    <input type="checkbox" />
                  </Col>
                  <Col xs={3}>{record.document}</Col>
                  <Col xs={3}>{record.submitted_by}</Col>
                  <Col xs={2}>{record.date_filed}</Col>

                  <Col xs={3}>
                    <a
                      className="anchor-color"
                      onClick={() => {
                        window.open(
                          "https://safe-fortress-44327.herokuapp.com/read/" +
                            record.enc_doc_name,
                          "_blank"
                        );
                      }}
                    >
                      View
                    </a>
                  </Col>
                </Row>
              ))}
              <Row className="table-header-order-endorse half-padding" />
            </Container>
          </div>
        )}
        {subFile.continuing_record <= 0 ? (
          ""
        ) : (
          <div className="padding-top-three">
            <h2>Continuing record - document volume</h2>
            <Container className="solid-border">
              <Row className="table-header-cont-record hide-borders padding-full-one ">
                <Col xs={1}>
                  <input type="checkbox" />
                </Col>

                <Col xs={1}>
                  <MaterialIcon icon="save_alt" color="#000000" />
                </Col>
                <Col xs={1}>
                  <MaterialIcon icon="print" color="#000000" />
                </Col>
              </Row>
              <Row className="hide-borders dark-font ">
                <Col xs={1} />
                <Col xs={3} className="right-border">
                  Form Title
                </Col>
                <Col xs={2} className="right-border">
                  Date Filed
                </Col>
                <Col xs={3} className="right-border">
                  Filing Party
                </Col>
                <Col xs={3}>Action</Col>
              </Row>
              {subFile.continuing_record.map(record => (
                <Row
                  key={record.document}
                  className="hide-borders padding-full-one "
                >
                  <Col xs={1}>
                    <input type="checkbox" />
                  </Col>
                  <Col xs={3}>{record.document}</Col>
                  <Col xs={2}>{record.date_filed}</Col>
                  <Col xs={3}>{record.submitted_by}</Col>
                  <Col xs={3}>
                    <a
                      className="anchor-color"
                      onClick={() => {
                        window.open(
                          "https://safe-fortress-44327.herokuapp.com/read/" +
                            record.enc_doc_name,
                          "_blank"
                        );
                      }}
                    >
                      View
                    </a>
                  </Col>
                </Row>
              ))}
              <Row className="table-header-cont-record half-padding" />
            </Container>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default SubCase;
