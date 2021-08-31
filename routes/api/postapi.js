const express = require('express');
const router = express.Router();
const post = require('../../models/posts')
const user = require('../../models/users')
const { isLoggedIn } = require('../../middleware')
router.get('/api/post', isLoggedIn, async (req, res) => {
    const filter = req.query
    const results = await post.find(filter)
        .populate("postedBy")
        .populate("retweetData")
        .populate("replyTo");

    posts = await user.populate(results, { path: "replyTo.postedBy" });
    res.json(posts);
});
router.get('/api/post/:id', async (req, res) => {
    const posts = await post.findById(req.params.id).populate("postedBy");
    res.status(200).json(posts);

})
router.post('/api/post', isLoggedIn, async (req, res) => {
    let Post = {
        content: req.body.content,
        postedBy: req.user
    }
    if (req.body.replyTo) {
        Post = {
            ...Post,
            replyTo: req.body.replyTo
        }
    }
    const newPost = await post.create(Post);
    res.json(newPost);
})
router.patch('/api/posts/:id/like', isLoggedIn, async (req, res) => {
    const postid = req.params.id;
    const userid = req.user._id;
    const isLiked = req.user.likes && req.user.likes.includes(postid);
    const option = isLiked ? '$pull' : '$addToSet';
    req.user = await user.findByIdAndUpdate(userid, { [option]: { likes: postid } }, { new: true });
    const Post = await post.findByIdAndUpdate(postid, { [option]: { likes: userid } }, { new: true });
    res.status(200).json(Post);

})
router.post('/api/posts/:id/retweet', isLoggedIn, async (req, res) => {
    const postid = req.params.id;
    const userid = req.user._id;

    var deletePost = await post.findOneAndDelete({ postedBy: userid, retweetData: postid })
    var option = deletePost != null ? "$pull" : "$addToSet";
    var repost = deletePost;
    if (repost == null) {
        repost = await post.create({ postedBy: userid, retweetData: postid })
    }

    req.user = await user.findByIdAndUpdate(userid, { [option]: { retweets: repost._id } });
    var Post = await post.findByIdAndUpdate(postid, { [option]: { retweetUsers: userid } })
    res.status(200).json(Post);

})

module.exports = router;