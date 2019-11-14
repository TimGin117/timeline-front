import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Layout } from "antd";
import DrawerForm from "./DrawerForm";

const { Footer, Sider, Content } = Layout;

ReactDOM.render(
  <div>
    <DrawerForm></DrawerForm>
    <App />
  </div>,
  document.getElementById("root")
);
