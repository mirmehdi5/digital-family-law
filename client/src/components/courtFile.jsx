import React from "react";
import SubCase from "./subCase";
import "react-table/react-table.css";
import Header from "./header";
import "../app.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import MaterialIcon from "material-icons-react";

class CourtFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: this.props.location.state.userName,
      id: this.props.location.state.courtCase.id,
      position: this.props.location.state.courtCase.sub_files.indexOf(
        this.props.location.state.courtCase.sub_files[0]
      ),
      subFile: this.props.location.state.courtCase.sub_files[0],
      applicant: this.props.location.state.courtCase.applicant,
      respondent: this.props.location.state.courtCase.respondent
    };
  }

  handleSubFileChange = subFile => {
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/getData?name=" +
        this.state.userName
    )
      .then(data => data.json())
      .then(res => {
        this.setState({
          // subFile,
          subFile:
            res.data[0].sub_files[
              this.props.location.state.courtCase.sub_files.indexOf(subFile)
            ],
          position: this.props.location.state.courtCase.sub_files.indexOf(
            subFile
          )
        });
      });
  };
  render() {
    const { courtCase } = this.props.location.state;
    return (
      <React.Fragment>
        {/* {this.props.location.state.userType !== "general" && <Header />} */}
        <Container className="bottom-padding-two">
          <img src="./dfl/fml.png" className="fml-img" />
          <Row className="padding-top-three ">Court File Number </Row>
          <Row>
            <Col xs={8}>
              <Row>
                <h2>{courtCase.id} - </h2>
                {courtCase.sub_files.length <= 0
                  ? "NO DB ENTRIES YET"
                  : courtCase.sub_files.map(subFile => (
                      <button
                        onClick={() => this.handleSubFileChange(subFile)}
                        key={subFile.number}
                        className="btn-as-tabs"
                      >
                        {subFile.number}
                        <br />
                      </button>
                    ))}
              </Row>
            </Col>
            <Col xs={4}>
              <Row>
                <b>Family - Superior Court of Justice</b>
              </Row>
              <Row>85 Frederick St, Kitchener, ON N2H 0A7</Row>
              <Row>519-741-3200/3300</Row>
            </Col>
          </Row>
          <hr />

          <SubCase
            subFileData={this.state}
            id={this.state}
            onDocsUpload={this.handleDocsUpload}
            userType={this.props.location.state.userType}
          />
          <div className="padding-top-three">
            {courtCase.other_documents <= 0 ? (
              ""
            ) : (
              <React.Fragment>
                <h2>Other documents</h2>
                <Container className="solid-border">
                  <Row className="table-header-other-docs hide-borders padding-full-one ">
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

                  {courtCase.other_documents.map(record => (
                    <Row
                      key={record.document}
                      className="hide-borders padding-full-one"
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
                  <Row className="table-header-other-docs half-padding" />
                </Container>
              </React.Fragment>
            )}
          </div>

          <div className="padding-top-three">
            {courtCase.rejected_docs <= 0 ? (
              ""
            ) : (
              <React.Fragment>
                <h2>Rejected documents</h2>
                <Container className="solid-border">
                  <Row className="table-header-rejected-docs hide-borders padding-full-one ">
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
                      Filing Party
                    </Col>
                    <Col xs={3}>Action</Col>
                  </Row>

                  {courtCase.rejected_docs.map(record => (
                    <Row
                      key={record.document}
                      className="hide-borders padding-full-one"
                    >
                      <Col xs={1}>
                        <input type="checkbox" />
                      </Col>
                      <Col xs={3}>{record.document}</Col>

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
                  <Row className="table-header-rejected-docs half-padding" />
                </Container>
              </React.Fragment>
            )}
          </div>
        </Container>
      </React.Fragment>
    );
  }
  handleDocsUpload = position => {
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/getData?name=" +
        this.state.userName
    )
      .then(data => data.json())
      .then(res => {
        this.setState({
          subFile: res.data[0].sub_files[position],
          position
        });
      });
  };
}
export default CourtFile;
