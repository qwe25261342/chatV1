<template>
  <div class="container">
    <div class="contant">
      <nav>
        <ul>
          <li><a href="/signout" @click="signout">登出</a></li>
        </ul>
        <div class="onlinebox">
          在線:
          <div v-for="item in online" class="online" :key="item.user_id">
            <p>&ensp;{{ item.username }}</p>
          </div>
        </div>
        <div class="searchbox">
          <van-field
            v-model="searchText"
            class="searchinput"
            @keyup.enter="search"
          />
          <b-button variant="outline-warning" class="btn" @click="search"
            >搜尋</b-button
          >
        </div>
      </nav>
      <div class="chatcontainer">
        <div class="list" id="list" ref="list">
          <ul>
            <li v-for="item in msgList" :key="item.id">
              <RightItem
                v-if="item.sender_id == user[0].user_id"
                :content="item.content"
                :username="item.username"
                :img="item.img"
                style="flex-direction: row-reverse"
              ></RightItem>
              <LeftItem
                v-else
                :content="item.content"
                :username="item.username"
                :img="item.img"
              ></LeftItem>
              <div v-scroll style="height: 0"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <div class="line"></div>
        <div class="input-send">
          <van-field
            v-model="content"
            id="content"
            placeholder="输入聊天内容..."
            class="input"
            autofocus
            @keyup.enter="send"
          />
          <van-button plain type="info" class="send" @click="send"
            >發送</van-button
          >
          <el-popover
            placement="top-start"
            width="300"
            trigger="click"
            class="emoBox"
          >
            <div class="emotionList">
              <a
                v-for="(item, index) in faceList"
                :key="index"
                href="javascript:void(0);"
                class="emotionItem"
                @click="getEmoji(index)"
                >{{ item }}</a
              >
            </div>
            <i class="el-icon-emoji" slot="reference"></i>
          </el-popover>
          <input
            id="upImageFile"
            :value="fileValue"
            type="file"
            @change="ImageToBase64"
          />
          <div>
            <img :src="iconBase64" alt="" height="168" />
            <van-button
              v-show="iconBase64"
              plain
              type="info"
              class="imgsend"
              @click="send"
              >發送</van-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import LeftItem from "@/components/LeftItem";
import RightItem from "@/components/RightItem";
import io from "socket.io-client";
import url from "../router/url"
const appApi = url.api
const appData = require("../static/emoji.json");
var socket = io( appApi );
Vue.directive("scroll", {
  inserted(el) {
    el.scrollIntoView();
  },
});
export default {
  name: "Chatbox",
  components: { LeftItem, RightItem },
  props: { user_id: String },
  data() {
    return {
      content: "",
      msgList: [],
      faceList: [],
      searchText: "",
      fileValue: "",
      iconBase64: "",
      online: [],
      user: [],
    };
  },
  methods: {
    //發送圖片&訊息
    send() {
      let params = {
        content: this.content,
        token: localStorage.getItem("token"),
        sender_id: this.sender_id,
        username: this.username,
        img: this.iconBase64,
      };
      //禁止傳送空值
      if (this.content == "" && this.iconBase64 == "") {
        return false;
      }
      axios
        .post( appApi + "/message", { params })
        .then((res) => {
          console.log(res.data);
          if (res.data.success == false) {
            this.$router.push({ name: "Login" });
            alert("請登入");
          }
        })
        .catch((err) => console.error(err));
      this.content = "";
      this.iconBase64 = "";
    },
    //搜尋使用者聊天紀錄
    search() {
      let params = {
        username: this.searchText,
        token: localStorage.getItem("token"),
      };
      axios
        .post( appApi + "/searchmsg", { params })
        .then((res) => {
          if (res.data.length == 0) {
            axios
              .post( appApi + "/allmessage", { params })
              .then((res) => {
                this.msgList = res.data;
                this.searchText = "";
                alert("查無資訊");
              });
          } else {
            this.msgList = res.data;
          }
        });
    },
    //圖片轉base64
    ImageToBase64() {
      let files = document.getElementById("upImageFile").files[0];
      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = () => {
        console.log("file=>" + reader.result);
        this.iconBase64 = reader.result;
      };
      reader.onerror = function (error) {
        console.log(error);
      };
    },
    //登出
    signout() {
      let params = {
        token: localStorage.getItem("token"),
      };
      localStorage.clear();
      axios.post( appApi + "/signout", { params });
    },
    //獲取表情包
    getEmoji(index) {
      let selectionStart = document.getElementById("content").selectionStart;
      let start = this.content.substring(0, selectionStart);
      let end = this.content.substring(selectionStart + 1);
      let emoji = this.faceList[index];
      this.content = start + emoji + end;
    },
  },
  mounted() {
    let params = {
      msg: this.content,
      token: localStorage.getItem("token"),
    };
    //表情符號
    for (let i in appData) {
      this.faceList.push(appData[i].char);
    }
    //登入時取使用者ID
    axios
      .post( appApi + "/getuserid", { params })
      .then((res) => {
        if (res.data.length == 0) {
          this.$router.push({ name: "Login" });
          alert("請登入");
          //console.log(res);
        } else {
          this.user = res.data;
        }
      });
    //登入時取所有聊天資料
    axios
      .post( appApi + "/allmessage", { params })
      .then((res) => {
        this.msgList = res.data;
      });
    //登入時取在線名單
    axios
      .post( appApi + "/onlinename", { params })
      .then((res) => {
        this.online = res.data;
      });
    //使用者登出重新取在線名單
    socket.on("userleft", () => {
      axios
        .post( appApi + "/onlinename", { params })
        .then((res) => {
          this.online = res.data;
        });
    });
    //發送訊息&圖片 接收socket通知 去資料庫取得所有資料
    socket.on("receive-msg", () => {
      axios
        .post( appApi + "/allmessage", { params })
        .then((res) => {
          this.msgList = res.data;
        });
    });
    //用戶登入取在線名單
    socket.emit("login", "用戶登入");
    socket.on("users", () => {
      axios
        .post( appApi + "/onlinename", { params })
        .then((res) => {
          this.online = res.data;
        });
    });
  },
};
</script>

<style>
@import "../style/chat.css";
</style>