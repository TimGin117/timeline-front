import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Upload, message, Button, Icon } from "antd";

// const baseURL = "http://localhost:8080/timeline/addFile";

export default class FileUpload extends React.Component {
  state = {
    fileList: []
  };

  render() {
    const fileList = this.state.fileList;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };
    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    );
  }
}
