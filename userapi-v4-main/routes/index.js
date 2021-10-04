"use strict"
const runQuery = require('../database/runquery')
const express = require('express');
const router = express.Router();
const controllersAuth = require('../controllers/mysql');


router.use('/token',async (req,res,next) =>{
    const req_params = req.body.params
    const token = req_params.token
    const msgToken = 'SELECT user_id FROM tokens where token= ? '
    const result = await runQuery(msgToken, token)
    req.user_id = result
    next();
})
router.get('/login', controllersAuth.login);
router.post('/register', controllersAuth.register);
router.post('/token/message', controllersAuth.message);
router.post('/token/allmessage', controllersAuth.allmessage);
router.post('/signout', controllersAuth.signout);
router.post('/getuserid', controllersAuth.getuserid);
router.post('/searchmsg', controllersAuth.searchmsg);
router.post('/onlinename', controllersAuth.onlinename);


module.exports = router;