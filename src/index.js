import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import { Layout } from "antd";

const { Footer, Sider, Content } = Layout;

ReactDOM.render(
  <Layout>
    <Sider width="250" theme="light" className="sider"></Sider>
    <Layout>
      <Content>
        <App />
      </Content>
      <Footer className="footer">TimeLine ©2019 Created by Ecnu Coder</Footer>
    </Layout>
    <Sider width="250" theme="light" className="sider"></Sider>
  </Layout>,
  document.getElementById("root")
);
