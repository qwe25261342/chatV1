<template>
  <div  class="container">
    <div class="contant">
    <nav>
      <ul>
        <li><a href="/">註冊</a></li>
        <li><a href="/chat">聊天室</a></li>
      </ul>
    </nav>
    <div class="login-container">
      <div class="card"  ref="loginForm">
        <div class="card-header">登入頁面</div>
        <div class="card-body">
          <form ref="loginForm">
            <div class="form-group">
              <label for="name">使用者名稱</label>
              <input
                v-model="loginForm.username"
                id="name"
                type="text"
                class="form-control"
                name="name"
              />
            </div>
            <div class="form-group">
              <label for="password">密碼</label>
              <input
                v-model="loginForm.password"
                id="password"
                type="password"
                class="form-control"
                name="password"
              />
            </div>
            <button
              type="primary"
              class="btn btn-primary"
              @click.prevent="loginUser"
            >
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../router/url"
const appApi = url.api
// var root = 'http://localhost:3050/login'

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    loginUser() {
      let params = {
        username: this.loginForm.username,
        password: this.loginForm.password,
        token: localStorage.getItem("token"),
      };
      axios
        .get( appApi +  "/login", { params })
        .then((res) => {
          if (res.data.success) {
            var token = res.data.token;
            //儲存Token到localStorage
            localStorage.setItem("token", token);
            token = JSON.stringify(token);
            this.$router.push(location.replace("/chat"));
          } else {
            this.loginForm.username = "";
            this.loginForm.password = "";
            alert("帳號密碼輸入錯誤");
            console.log(res);
          }
        });
    },
  },
};
</script>

<style>
nav {
  background-color: #563d7c;
  color: #fff;
  padding: 30px 60px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  left: 0;
  top: 0;
}

nav ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

nav li {
  list-style: none;
}

nav li a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 8px;
}
nav li a:hover {
  color: orange;
  text-decoration: none;
}
.login-container {
  padding-top: 117px;
}

.form-group {
  padding-bottom: 7px;
}
.form-group {
  padding-bottom: 7px;
}
.btn-primary{
  width: 200px;
}
</style>

