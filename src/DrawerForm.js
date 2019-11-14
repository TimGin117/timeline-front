import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Drawer, Form, Button, Col, Row, Input, Icon } from "antd";
import PicturesWall from "./PicturesWall";
import FileUpload from "./FileUpload";

const { TextArea } = Input;

const baseURL = "http://localhost:8080/timeline/add";

class DrawerForm extends React.Component {
  state = {
    visible: false
  };

  constructor(props) {
    super(props);

    this.fileUploadRef = React.createRef();
    this.pictureRef = React.createRef();
    this.fileInput = React.createRef();
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      // console.log(this.pictureRef.current.state);
      // console.log(this.fileUploadRef.current.state);

      let formData = new FormData();
      formData.append("publisher", values.publisher);
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("photo", this.pictureRef.current.state.file);

      if (!err) {
        fetch(baseURL, {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(JsonRes => {
            console.log(JsonRes);
            this.onClose();
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="post-button">
        <Button type="primary" onClick={this.showDrawer}>
          <Icon type="plus" /> New Post
        </Button>
        <Drawer
          title="Create a new post"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="publisher">
                  {getFieldDecorator("publisher", {
                    rules: [
                      { required: true, message: "Please enter your name" }
                    ]
                  })(<Input placeholder="Please enter your name" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="title">
                  {getFieldDecorator("title", {
                    rules: [
                      { required: true, message: "Please enter the title" }
                    ]
                  })(<Input placeholder="Please enter the title" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="content">
                  {getFieldDecorator("content", {
                    rules: [
                      { required: true, message: "Please enter some message" }
                    ]
                  })(
                    <TextArea
                      placeholder="Please enter some message"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="photo">
                  {getFieldDecorator("photo", {
                    rules: [{ required: false }]
                  })(<PicturesWall ref={this.pictureRef}></PicturesWall>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="file">
                  {getFieldDecorator("file", {
                    rules: [{ required: false }]
                  })(<FileUpload ref={this.fileUploadRef}></FileUpload>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}
const NewPost = Form.create()(DrawerForm);
export default NewPost;
