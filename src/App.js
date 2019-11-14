import React from "react";
import "./App.css";
import { List, Avatar, Button, Skeleton } from "antd";

// import reqwest from "reqwest";
// import axios from "axios";

const count = 5;
const baseUrl = `http://localhost:8080/timeline/`;

class App extends React.Component {
  state = {
    pageOffset: 0,
    initLoading: true,
    loading: false,
    data: [],
    list: []
  };

  //初始化请求
  componentDidMount() {
    this.getRecentNews(res => {
      this.setState({
        pageOffset: res.data.length,
        initLoading: false,
        data: res.data,
        list: res.data
      });
    });
  }

  getRecentNews = callback => {
    // reqwest({
    //   url: fakeDataUrl,
    //   type: "json",
    //   method: "get",
    //   contentType: "application/json",
    //   success: res => {
    //     alert(JSON.stringify(res));
    //     callback(res);
    //   }
    // });
    let url = baseUrl + "recentNews?pageOffset=" + this.state.pageOffset;

    fetch(url, {
      type: "json",
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then(JsonRes => {
        console.log(JSON.stringify(JsonRes));
        callback(JsonRes);
      })
      .catch(err => console.log(err));
  };

  getLatestNews = callback => {
    if (this.state.data.length === 0) {
      console.log("error: no data");
      return;
    }
    let time = this.state.data[0].publishTime.replace("T", " ");
    console.log(time);
    let url = baseUrl + "latestNews?time=" + time;
    fetch(url, {
      type: "json",
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then(JsonRes => {
        console.log(JSON.stringify(JsonRes));
        callback(JsonRes);
      })
      .catch(err => console.log(err));
  };

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          publisher: {},
          title: {},
          content: {}
        })) //直接new Array(count).map()无效，hasOwnProperty false
      )
    });
    this.getRecentNews(res => {
      if (res.data.length === 0) {
        this.setState({
          data: this.state.data,
          list: this.state.data,
          loading: false,
          pageOffset: this.state.data.length
        });
        alert("No more news");
        return;
      }
      const data = this.state.data.concat(res.data);
      this.setState(
        {
          data,
          list: data,
          loading: false,
          pageOffset: data.length
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
      list: [...new Array(1)]
        .map(() => ({
          loading: true,
          publisher: {},
          title: {},
          content: {}
        }))
        .concat(this.state.data) //直接new Array(count).map()无效，hasOwnProperty false
    });

    this.getLatestNews(res => {
      const data = res.data.concat(this.state.data);

      this.setState(
        {
          data,
          list: data,
          loading: false,
          pageOffset: data.length
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

    const timestampFormat = time => {
      const zeroize = num => {
        return (String(num).length === 1 ? "0" : "") + num;
      };
      let timestamp = parseInt(new Date(time).getTime() / 1000);
      let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
      let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

      let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
      let tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

      let Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
      let H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();

      if (timestampDiff < 60) {
        // 一分钟以内
        return "刚刚";
      } else if (timestampDiff < 3600) {
        // 一小时前之内
        return Math.floor(timestampDiff / 60) + "分钟前";
      } else if (
        curDate.getFullYear() === Y &&
        curDate.getMonth() + 1 === m &&
        curDate.getDate() === d
      ) {
        return "今天" + zeroize(H) + ":" + zeroize(i);
      } else {
        let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (
          newDate.getFullYear() === Y &&
          newDate.getMonth() + 1 === m &&
          newDate.getDate() === d
        ) {
          return "昨天" + zeroize(H) + ":" + zeroize(i);
        } else if (curDate.getFullYear() === Y) {
          return (
            zeroize(m) +
            "月" +
            zeroize(d) +
            "日 " +
            zeroize(H) +
            ":" +
            zeroize(i)
          );
        } else {
          return (
            Y +
            "年" +
            zeroize(m) +
            "月" +
            zeroize(d) +
            "日 " +
            zeroize(H) +
            ":" +
            zeroize(i)
          );
        }
      }
    };

    return (
      <div className="App">
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
            <List.Item className="list-item">
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={
                    <div>
                      <div
                        style={{
                          color: "grey",
                          textAlign: "left",
                          fontSize: "12px"
                        }}
                      >
                        作者：{item.publisher}&#12288;&#12288; 发布于：
                        {timestampFormat(item.publishTime)}
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          fontSize: "16px",
                          fontWeight: 800
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          textAlign: "left"
                        }}
                      >
                        &#12288;&#12288;{item.content}
                      </div>
                    </div>
                  }
                  // description={item.content}
                />

                <div className="picture">
                  <img
                    height="100px"
                    width="100px"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt=""
                  />
                </div>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default App;
