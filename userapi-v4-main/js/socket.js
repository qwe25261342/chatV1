"use strict" 

const chat = (io) =>{
const logger = require('../js/event');
let map = { }
//收到值 用socket emit傳送給前端
logger.on('messageLogged', (content, sender_id, created_at, username,img) => {
  console.log(content, sender_id, created_at, username,img);
  if(!map) {
    return
  }
  map.emit('receive-msg', content, sender_id, created_at, username,img)
});

//socket連接
  io.on('connection', socket => {
      socket.on('login', (data) => {
        socket.broadcast.emit('users', data); 
         console.log(data);
         //當登入時把資料帶出去外層,避免重複傳值
        map = io;
      });
      //斷開socket連結
      socket.on('disconnect',(data)=>{
        io.emit('userleft', data);
        console.log("left");
      })
    });

}
module.exports = {
  chat
}