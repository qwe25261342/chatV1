"use strict"

const express = require('express');
const router = express.Router();
const controllersAuth = require('../controllers/mysql');

router.get('/login', controllersAuth.login);
router.post('/register', controllersAuth.register);
router.post('/message', controllersAuth.message);
router.post('/allmessage', controllersAuth.allmessage);
router.post('/signout', controllersAuth.signout);
router.post('/getuserid', controllersAuth.getuserid);
router.post('/searchmsg', controllersAuth.searchmsg);
router.post('/onlinename', controllersAuth.onlinename);


module.exports = router;