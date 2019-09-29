import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Label,
  ButtonGroup,
  Button,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { Redirect } from "react-router";

class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.successFileName = "";
    this.state = {
      file: "",
      fileName: "",
      fileId: "",
      docTitle: "",
      docType: "",
      nav: false,
      sucessMessage: false
    };

    this.onChange = this.onChange.bind(this);
    this.resetFile = this.resetFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.updateDocTitle = this.updateDocTitle.bind(this);
    this.docType = this.docType.bind(this);
  }

  onChange(e) {
    if (!e.target.files[0]) {
      return;
    }

    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name
    });
  }

  updateDocTitle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  docType(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.value === "AFDO") {
      this.setState({
        docTitle: "Affidavit of Divorce"
      });
    } else if (e.target.value === "MIP") {
      this.setState({
        docTitle: "MIP Certificate"
      });
    } else if (e.target.value === "TOC") {
      this.setState({
        docTitle: "Table of Contents"
      });
    } else if (e.target.value === "APG") {
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

  resetFile(e) {
    e.preventDefault();
    this.setState({
      fileName: "",
      docTitle: "",
      docType: "",
      rSelected: ""
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const { file, docTitle, docType, rSelected } = this.state;
    const formData = new FormData();

    formData.append("docTitle", docTitle);
    formData.append("docType", docType);
    formData.append("fillingParty", rSelected);
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://safe-fortress-44327.herokuapp.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      this.successFileName = this.state.fileName;
      this.setState({
        fileId: res.data.file.filename,
        sucessMessage: true
      });

      var filingPerson = this.props.applicant;
      if (this.state.rSelected === "Respondent") {
        filingPerson = this.props.respondent;
      } else {
        filingPerson = this.props.applicant;
      }

      if (docType === "APG") {
        this.props.onUploadDB(
          this.props.id,
          this.props.position,
          filingPerson,
          "encoded",
          "Table of Contents"
        );
      }

      this.props.onUploadDB(
        this.props.id,
        this.props.position,
        filingPerson,
        res.data.file.filename,
        res.data.file.metadata.docTitle
      );
      this.setState({
        fileName: "",
        docTitle: "",
        docType: "",
        rSelected: ""
      });
    } catch (err) {
      console.log(err);
    }
  }

  onClick(rSelected) {
    this.setState({
      rSelected
    });
  }

  onRadioChanged = e => {
    this.setState({
      rSelected: e.currentTarget.value
    });
  };

  render() {
    const { fileName, fileId, rSelected, docTitle, docType, nav } = this.state;
    const isEnable =
      fileName && docTitle && docType
        ? fileName.length > 0 && docTitle.length > 0 && docType.length > 0
        : false;
    if (nav) {
      return (
        <Redirect
          to={{
            pathname: "/preview",
            state: {
              fileId
            }
          }}
        />
      );
    }
    return (
      <Container className="solid-border">
        <Row className="hide-borders ">
          <h4 className="padding-full-one">Upload and file a document</h4>
        </Row>

        <Row className="one-point-five-padding">
          <Col xs="4">
            <Label>Document(s)</Label>
            <Row>
              <Col>
                <Form onSubmit={this.onSubmit}>
                  <div className="custom-file mb-4">
                    <Input
                      type="file"
                      className="custom-file-input"
                      name="file"
                      id="customFile"
                      key={this.state.fileName}
                      onChange={this.onChange}
                    />
                    <Label className="custom-file-label" htmlFor="customFile">
                      {fileName}
                    </Label>

                    <Button
                      className="btn btn-danger btn-block mt-4 blue-color"
                      disabled={!isEnable}
                    >
                      File Document
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Col>

          <Col xs="4">
            {fileName && (
              <Row>
                <Col xs="4">
                  <Form>
                    <FormGroup>
                      <Label for="docType">Doc code</Label>
                      <Input
                        type="text"
                        name="docType"
                        id="docType"
                        onChange={this.docType}
                      />
                    </FormGroup>
                  </Form>
                </Col>
                <Col xs="8">
                  <Form>
                    <FormGroup>
                      <Label for="docTitle">Doc title</Label>
                      <Input
                        type="text"
                        name="docTitle"
                        id="docTitle"
                        value={docTitle}
                        onChange={this.updateDocTitle}
                      />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            )}
          </Col>

          <Col xs="3">
            {fileName && (
              <Container>
                <Row>
                  <Label>Filling party</Label>
                </Row>
                <Row>
                  <Col>
                    <Input
                      type="radio"
                      value="Applicant"
                      name="userType"
                      onChange={this.onRadioChanged}
                    />
                    <Label>Applicant</Label>
                  </Col>

                  <Col>
                    <Input
                      type="radio"
                      value="Respondent"
                      name="userType"
                      onChange={this.onRadioChanged}
                    />

                    <Label>Respondent</Label>
                  </Col>
                </Row>
              </Container>
            )}
          </Col>

          <Col xs="1">
            <Row style={{ marginTop: "1.9rem" }}>
              {fileName && (
                <img onClick={this.resetFile} src="./dfl/x.png" width="40px" />
              )}
            </Row>
          </Col>
        </Row>
        {this.state.sucessMessage && (
          <Container className="success-message-padding ">
            <Row className="bottom-padding-two">
              <Col xs={3} className="success-dark-green">
                <img src="./dfl/success.png" className="success-image-clerk" />
              </Col>
              <Col xs={9} className="success-light-green">
                <Container>
                  <Row className="padding-top-one">
                    Document successfully filed!
                  </Row>

                  <Row>
                    <ul>
                      <li>{this.successFileName}</li>
                    </ul>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    );
  }
}

export default FileUploader;
