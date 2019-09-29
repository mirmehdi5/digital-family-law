import React, { Component } from "react";
import CourtFile from "./courtFile";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { Container, Row, Col, Button } from "react-bootstrap";
import Preview from "./Preview";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

class Clerk extends Component {
  state = {
    data: [],
    dateFiled: "",
    submittedBy: "",
    showOrHide: false,
    nav: false,
    docFileID: "",
    courtFileNumber: "",
    recordList: [],
    tonyData: [
      {
        applicant: "Tony Rocks",
        duedate: "Sept 6 2019",
        id: "FS-19-111111"
      }
    ],
    searchChange: false
  };
  componentDidMount() {
    fetch("https://safe-fortress-44327.herokuapp.com/api/data/getDataClerk")
      .then(data => data.json())
      .then(res => {
        this.setState({ data: res.data });
      });

    fetch("https://safe-fortress-44327.herokuapp.com/api/data/getTonyData")
      .then(data => data.json())
      .then(res => {
        this.setState({ tonyData: res.data });
      });
  }
  handleSearchChange = () => {
    this.setState({ searchChange: true });
  };
  render() {
    const {
      data,
      nav,
      docFileID,
      courtFileNumber,
      recordList,
      dateFiled,
      submittedBy
    } = this.state;
    const style = this.state.showOrHide ? { display: "none" } : {};

    if (nav) {
      return (
        <Router>
          <Redirect
            to={{
              pathname: "/preview",
              state: {
                fileId: docFileID,
                courtFileNumber,
                preDateFiled: dateFiled,
                preSubmittedBy: submittedBy,
                recordList
              }
            }}
          />
          <Route path="/preview" component={Preview} />
        </Router>
      );
    }

    return (
      <Router>
        <Container style={style}>
          <Row className="padding-top-three">
            <h2>Family Law Records</h2>
          </Row>
          <Row className="padding-top-three">
            <h4>Search for a court file</h4>
          </Row>

          <Row>
            <a href="#" className="padding-top-two">
              View all files
            </a>
          </Row>
          <Row className="padding-top-two">
            <input
              className="search-bar"
              type="text"
              onChange={this.handleSearchChange}
              placeholder="Search by court file # or first and last name"
            />
          </Row>
          {this.state.searchChange && (
            <Row className="search-tony">
              {this.state.tonyData !== [] && (
                <Link
                  onClick={this.handleCard}
                  to={{
                    pathname: "/courtFile",
                    state: {
                      courtCase: this.state.tonyData[0],
                      userName: this.state.tonyData[0].applicant,
                      userType: "clerk"
                    }
                  }}
                >
                  {this.state.tonyData[0].id} 0000
                </Link>
              )}
            </Row>
          )}

          <Row className="padding-top-three">
            <h3>Document submissions requiring review</h3>
          </Row>
          <div className="padding-top-three">
            <Row>
              <b>Family - Superior court of justice</b>
            </Row>
            <Row>85 Fredrick St, Kitchener, ON N2H 0A7</Row>
            <Row>519-741-3200/3300</Row>
          </div>
          <Container className="padding-top-three">
            <Row className="table-header border-solid no-side-margins ">
              <Col xs={2} className="border-solid">
                Quantity <img src="./sort-icon.png" width="14px" />
              </Col>
              <Col xs={4} className="border-solid">
                Court File # <img src="./sort-icon.png" width="14px" />
              </Col>
              <Col xs={4} className="border-solid">
                Case Name <img src="./sort-icon.png" width="14px" />
              </Col>
              <Col xs={2} className="border-solid">
                Review Due Date <img src="./sort-icon.png" width="14px" />
              </Col>
            </Row>

            <Accordion>
              {data.length <= 0 ? (
                <div>NO DB ENTRIES YET</div>
              ) : (
                data.map(
                  dat =>
                    dat.sub_files.length > 0 &&
                    dat.sub_files.map(
                      record =>
                        record.pending_docs.length > 0 && (
                          <AccordionItem key={record.number}>
                            <AccordionItemHeading>
                              <AccordionItemButton>
                                <Row className="full-width accordian-margin-adjust">
                                  <Col xs={2}>{record.pending_docs.length}</Col>
                                  <Col xs={4}>
                                    <Link
                                      onClick={this.handleCard}
                                      to={{
                                        pathname: "/courtFile",
                                        state: {
                                          courtCase: dat,
                                          userName: dat.applicant,
                                          userType: "clerk"
                                        }
                                      }}
                                    >
                                      {dat.id} {record.number}
                                    </Link>
                                  </Col>

                                  <Col xs={4}>
                                    {dat.applicant} VS {dat.respondent}
                                  </Col>
                                  <Col xs={2}>
                                    {
                                      dat.sub_files[0].pending_docs[0]
                                        .review_date
                                    }
                                  </Col>
                                </Row>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                              <Row>
                                <Col xs={2} />
                                <Col
                                  xs={4}
                                  className="border-solid beige-background"
                                >
                                  File name
                                </Col>
                                <Col
                                  xs={4}
                                  className="border-solid beige-background"
                                >
                                  Filing Party
                                </Col>
                                <Col
                                  xs={2}
                                  className="border-solid beige-background"
                                >
                                  Review Due Date
                                </Col>
                              </Row>
                              {record.pending_docs.map(docs => (
                                <Row
                                  key={docs.document}
                                  className="full-width padding-top-one zero-margin-left"
                                >
                                  <Col xs={2} />

                                  <Col xs={4}>
                                    <div
                                      className="anchor-color"
                                      onClick={() =>
                                        this.setState({
                                          nav: true,
                                          docFileID: docs.enc_doc_name,
                                          dateFiled: docs.review_date,
                                          submittedBy: docs.submitted_by,
                                          recordList: record.pending_docs,
                                          courtFileNumber: dat.id
                                        })
                                      }
                                    >
                                      {docs.document}
                                    </div>
                                  </Col>

                                  <Col xs={4}>{docs.submitted_by}</Col>
                                  <Col>{docs.review_date}</Col>
                                </Row>
                              ))}
                            </AccordionItemPanel>
                          </AccordionItem>
                        )
                    )
                )
              )}
            </Accordion>
          </Container>
        </Container>
        <div className="bottom-padding-two " />
        <Switch>
          <Route path="/courtFile" component={CourtFile} />
        </Switch>
      </Router>
    );
  }
  handleCard = () => {
    this.props.onPageHide();
    this.setState({
      showOrHide: true
    });
  };
}

export default Clerk;
