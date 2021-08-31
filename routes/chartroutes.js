const express = require('express');
const router = express.Router();
const chat = require('../models/chat')
router.get('/message',(req,res)=>{
    res.render('chatpage',{user:req.user});
    
})
router.get('/allmsg',async(req,res)=>{
   const msg = await chat.find({});
   res.json(msg);

})

module.exports = router;