"use strict"
const EventEmitter = require('events');

//值傳送給socket
class Logger extends EventEmitter {
    log(content, sender_id, created_at, username,img) {
        this.emit('messageLogged', content, sender_id, created_at, username,img);
    }
}

const logger = new Logger()
module.exports = logger;

