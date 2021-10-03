"use strict"
const uuid = require('uuid');
const runQuery = require('../database/runquery')
const logger = require('../js/event');

async function check(token) {
  //先取得token找ID
  const msgToken = 'SELECT user_id FROM tokens where token= ? '
  const result = await runQuery(msgToken, token)
  if (result.length == 0) {
    throw new Error('my error:', error);
  }
  const sender_id = result[0].user_id
  return {
    sender_id: sender_id
  }
}
async function getuser(sender_id) {
  //再從ID找相對應的使用者
  const msguser = 'SELECT username FROM users where id= ? '
  const result = await runQuery(msguser, sender_id)
  if (result.length == 0) {
    throw new Error('my error:', error);
  }
  const username = result[0].username;
  return {
    username: username
  }
}
//登入
exports.login = async (req, res) => {
  try {
    const req_params = req.query
    const username = req_params.username
    const password = req_params.password
    const created_at = new Date()
    const params = [username, password]
    const sql = 'SELECT id,username,password FROM users where username=? AND password=?'
    //先刪除上次登入的TOKEN
    const deletetoken = 'DELETE FROM tokens WHERE username = ?'
    const addtoken = 'insert into tokens(token,user_id,created_at, username) VALUES( ?, ?, ?, ?)'
    const usetoken = 'SELECT token FROM tokens WHERE user_id = ?'
    await runQuery(deletetoken, username);
    const result = await runQuery(sql, params);
    const user_id = result[0].id
    const tokenparams = [uuid.v1().toString(), user_id, created_at, username]
    await runQuery(addtoken, tokenparams);
    await runQuery(usetoken, user_id);
    res.send({ data: result, success: true, message: '登入成功!', token: tokenparams[0] })
  } catch (error) {
    res.send({
      success: false,
      message: '登入失败！'
    })
  }
}
//登出
exports.signout = async function (res, req) {
  try {
    const res_params = res.body.params
    const token = res_params.token;
    await runQuery(`DELETE FROM tokens WHERE token = ? `, token);
  } catch (error) {
    res.send({
      error
    })
  }
}
//註冊
exports.register = async (req, res) => {
  try {
    const req_params = req.query
    const username = req_params.username
    const password = req_params.password
    const phone = req_params.phone
    const created_at = new Date()
    const params = [username, password, phone, created_at]
    const sql = 'insert into users(username,password,phone,created_at) VALUES( ?, ?, ?, ? )'
    await runQuery(sql, params);
    res.send({ success: true, message: '註冊完成！' })
  } catch (error) {
    res.send({
      success: false,
      message: '註冊失败！'
    })
  }
}
//傳送訊息
exports.message = async (req, res) => {
  try {
    const req_params = req.body.params
    const content = req_params.content
    const token = req_params.token
    const img = req_params.img
    const created_at = new Date()
    const { sender_id } = await check(token)
    const { username } = await getuser(sender_id)
    const sql = 'insert into messages(content, sender_id, created_at, username,img) VALUES( ?, ?, ?, ?, ? )'
    const params = [content, sender_id, created_at, username, img]
    const result = await runQuery(sql, params)
    if (result.affectedRows == 1) {
      // 資料傳送給even.js傳值
      logger.log(content, sender_id, created_at, username, img)
    }
    res.send({ sender_id, username })
  } catch (error) {
    res.send({
      success: false
    })
  }
}
//進入頁面取得之前所有的訊息
exports.allmessage = async (req, res) => {
  try {
    //防止沒token 直接取聊天紀錄
    const req_params = req.body.params
    const token = req_params.token
    await check(token)
    const sql = 'SELECT content,sender_id,username,img FROM messages '
    const result = await runQuery(sql)
    res.send(result);
  } catch (error) {
    res.send({
      success: false
    })
  }
}
//取得登入的使用者id
exports.getuserid = async (req, res) => {
  try {
    const req_params = req.body.params
    const token = req_params.token
    await check(token)
    const msgToken = 'SELECT user_id FROM tokens where token= ? '
    const result = await runQuery(msgToken, token);
    res.send(result);
  } catch (error) {
    res.send({
      success: false
    })
  }
}
//取得所有在線名單
exports.onlinename = async (req, res) => {
  try {
    const req_params = req.body.params
    const token = req_params.token
    await check(token)
    const online = 'SELECT username FROM tokens '
    const result = await runQuery(online);
    res.send(result);
  } catch (error) {
    res.send({
      success: false
    })
  }
}
//搜尋聊天紀錄
exports.searchmsg = async (req, res) => {
  try {
    const msgToken = 'SELECT user_id FROM tokens where token=?'
    const searchMsg = 'SELECT content,username,img FROM messages where username = ?'
    const req_params = req.body.params
    const token = req_params.token
    const username = req_params.username
    await runQuery(msgToken, token)
    const result = await runQuery(searchMsg, username);
    res.send(result);
  } catch (error) {
    res.send({
      success: false
    })
  }
  //取得最後一筆資料
  // exports.lastuser = async(req, res) => {
  //   try
  //     let online =' SELECT username FROM tokens ORDER BY created_at DESC LIMIT 1'
  //     const result = await runQuery(online);
  //     res.send(result);
  //   }catch(error){
  //     console.log(error)
  //   }
  // }
}