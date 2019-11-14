import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Upload, message, Button, Icon } from "antd";

// const baseURL = "http://localhost:8080/timeline/addFile";

export default class FileUpload extends React.Component {
  state = {
    file: {}
  };

  render() {
    const uploadFile = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text"
      },
      onChange: info => {
        this.setState({
          file: info.file
        });
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };
    return (
      <Upload {...uploadFile}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    );
  }
}
