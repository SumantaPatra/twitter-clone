const express = require('express');
const router = express.Router();
const post = require('../models/posts')
const user = require('../models/users')
const { isLoggedIn } = require('../middleware')
router.get('/profile', isLoggedIn, (req, res) => {
    const payLoad = {
        user: req.user,
        displayname: req.user.firstName + " " + req.user.lastname
    }
    res.render('profile', { payLoad });
})
router.get('/profile/:userName', async (req, res) => {
    const users = await user.findOne({ username: req.params.userName });

    const payLoad = {
        user: users,
        displayname: users.firstName + " " + users.lastname
    }
    res.render('profile', { payLoad });
})

router.get('/follow/:userid/:followid', async (req, res) => {
    const { userid, followid } = req.params;

    const currentUser = await user.findById(userid)
    const followUser = await user.findById(followid)

    currentUser.following.addToSet(userid)
    followUser.followers.addToSet(followid)
    await currentUser.save();
    await followUser.save();

    res.redirect(`/profile/${followUser.username}`)

})
module.exports = router;