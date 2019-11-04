import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import { List, Avatar, Button, Skeleton } from "antd";

import reqwest from "reqwest";

const count = 6;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

class App extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: []
  };

  componentDidMount() {
    this.getData(res => {
      this.setState({
        initLoading: false,
        data: res.results,
        list: res.results
      });
    });
  }

  getData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: res => {
        alert(JSON.stringify(res));
        callback(res);
      }
    });
    // fetch(fakeDataUrl, {
    //   type: "json",
    //   method: "GET",
    //   mode: "cors",
    //   headers: {
    //     "content-type": "application/json"
    //   }
    // }).then(res => callback(res));
  };

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          email: {}
        })) //直接new Array(count).map()无效，hasOwnProperty false
      )
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event("resize"));
        }
      );
    });
  };

  onUpdate = () => {
    this.setState({
      loading: true,
      list: [...new Array(count)]
        .map(() => ({
          loading: true,
          name: {},
          email: {}
        }))
        .concat(this.state.data)
    });

    this.getData(res => {
      const data = res.results.concat(this.state.data);
      this.setState(
        {
          data,
          list: data,
          loading: false
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event("resize"));
        }
      );
    });
  };

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            marginBottom: 12,
            height: 32,
            lineHeight: "32px"
          }}
        >
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null;

    return (
      <div>
        <header className="App-header">
          <div className="title">TimeLine</div>
          <Button onClick={this.onUpdate} className="updateButton">
            Update
          </Button>
        </header>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description={item.email}
                />
                <div className="timeStamp">5分钟前</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default App;
