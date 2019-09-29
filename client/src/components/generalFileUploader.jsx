import React, { Component } from "react";
import { Container, Row, Col, Label, Button, Form, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";

class GeneralFileUploader extends Component {
  constructor(props) {
    super(props);

    this.successFileName = "";
    this.state = {
      files: [],
      file: "",
      fileName: "",
      fileId: "",
      docTitle: "",
      docType: "",
      sucessMessage: false
    };

    this.onChange = this.onChange.bind(this);
    this.resetFile = this.resetFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.onClick = this.onClick.bind(this);
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

  docType(e) {
    this.setState({
      [e.target.name]: e.target.value,
      docType: e.target.value
    });
    if (e.target.value === "AFDO") {
      this.setState({
        docTitle: "Affidavit of Divorce"
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
    const {
      files,
      file,
      docTitle,
      docType,
      rSelected,
      sucessMessage
    } = this.state;
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

      this.props.onUploadDB(
        this.props.id,
        this.props.position,
        this.props.applicant,
        res.data.file.filename,
        this.state.fileName
      );
    } catch (err) {
      console.log(err);
    }
    this.setState({
      fileName: "",
      docTitle: "",
      docType: "",
      rSelected: ""
    });
  }

  onClick(rSelected) {
    this.setState({
      rSelected
    });
  }

  render() {
    const { fileName, fileId, rSelected, docTitle, docType } = this.state;
    const isEnable =
      fileName && docTitle && docType
        ? fileName.length > 0 && docTitle.length > 0 && docType.length > 0
        : false;

    return (
      <Container className="solid-border">
        <Row className="mb-4">
          <Container>
            <Row className="hide-borders padding-left-three ">
              <h4 className="padding-full-one">
                Add document to this case for court clerk review
              </h4>
            </Row>
            <div className="padding-left-three">
              <Row>
                <b>Note:</b> Only documents that have been commissioned and
                served to the other party can be uploaded. The Mandatory
                Information Program completion certificate can also be uploaded.
              </Row>
              <Col xs="4">
                <Row>
                  <Col>
                    <Row className="padding-top-three">
                      <h5>Document(s)</h5>
                    </Row>
                    <Form onSubmit={this.onSubmit}>
                      <div className="custom-file mb-4">
                        <Row>
                          <Col xs={8}>
                            <Input
                              type="file"
                              className="custom-file-input"
                              name="file"
                              id="customFile"
                              key={this.state.fileName}
                              onChange={this.onChange}
                            />
                            <Label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              {fileName}
                            </Label>
                          </Col>

                          <Col xs="1">
                            <Row>
                              {fileName && (
                                <img
                                  onClick={this.resetFile}
                                  src="./dfl/x.png"
                                  width="40px"
                                />
                              )}
                            </Row>
                          </Col>
                        </Row>

                        <Button className="btn btn-block mt-4 blue-color">
                          Submit document for clerk
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </Col>
            </div>
          </Container>
        </Row>
        {this.state.sucessMessage && (
          <Container className="success-message-padding ">
            <Row className="bottom-padding-two">
              <Col xs={3} className="success-dark-green">
                <img src="./dfl/success.png" className="success-image" />
              </Col>
              <Col xs={9} className="success-light-green">
                <Container>
                  <Row className="padding-top-one">
                    Document submission successful
                  </Row>
                  <Row>
                    Your Document will be reviewed by a court clerk within 2
                    business days.
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

export default GeneralFileUploader;
