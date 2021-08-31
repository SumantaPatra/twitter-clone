async function refreshTweets() {
    $('#allTweets').empty();
    const tweets = await axios.get('/api/post');
    for (let post of tweets.data) {
        const html = createPostHtml(post);
        $('#allTweets').prepend(html);
    }

}
refreshTweets();
$('#submitPostButton').click(async () => {
    const postText = $('#post-text').val();
    const newPost = await axios.post('/api/post', { content: postText });
    refreshTweets();
    $('#post-text').val("");
})
$(document).on('click', '.likeButton', async (event) => {
    const element = $(event.target);
    const postId = getIdFromelements(element);
    const postData = await axios.patch(`/api/posts/${postId}/like`);
    element.find("span").text(postData.data.likes.length);
    location.reload();

})
$(document).on('click', '.retweet', async (event) => {
    const element = $(event.target);
    const postId = getIdFromelements(element);
    const postData = await axios.post(`/api/posts/${postId}/retweet`);
    element.find("span").text(postData.data.retweetUsers.length);
    // if (postData.retweetUsers.includes(userLoggedIn._id)) {
    //     button.addClass("active");
    // }
    // else {
    //     button.removeClass("active");
    // }

    location.reload();
})
// $(document).on('click', '.post', async (event) => {
//     var element = $(event.target);
//     if (element.is("button")) {
//         console.log('button is clicked');
//     }
//     const postId = getIdFromelements(element);
//     // if (postId !== undefined) {
//     //     window.location.href = '/post/' + postId;
//     // }

// })
function getIdFromelements(element) {
    const Isroot = element.hasClass('post');
    const rootElement = Isroot === true ? element : element.closest('.post');
    const postId = rootElement.data().id;
    return postId;
}
$('#replyModal').on('show.bs.modal', async (event) => {
    const element = $(event.relatedTarget);
    const postId = getIdFromelements(element);
    $('#submitReplyButton').attr('data-id', postId);
    const post = await axios.get(`/api/post/${postId}`);
    const html = createPostHtml(post.data);
    $('#originalPostContainer').append(html);

})
$('#submitReplyButton').click(async (event) => {
    const element = $(event.target);
    const postText = $('#reply-text-container').val();
    const replyTo = element.attr('data-id');
    const post = await axios.post('/api/post/', { content: postText, replyTo: replyTo });
    location.reload();

})
function createPostHtml(postData) {
    const postedBy = postData.postedBy;

    if (postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    var retweet = postData.retweetData !== undefined;
    var retweetby = retweet ? postData.postedBy.username : null;
    postData = retweet ? postData.retweetData : postData;

    const displayName = postedBy.firstName + " " + postedBy.lastname;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    let replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
        if (!postData.replyTo._id) {
            return alert("Reply to is not populated");
        } else if (!postData.replyTo.postedBy._id) {
            return alert("Posted by is not populated");
        }

        const replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class='replyFlag'>
                            Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}<a>
                        </div>`;
    }

    var retweetText = '';
    if (retweet) {
        retweetText = `<span>
        <i class='fas fa-retweet'></i>
        Retweeted By <a href='/profile/${retweetby}' >@${retweetby}</a>
        </span>`
    }

    return `<div class='post' data-id='${postData._id}'>
               <div class='retweetUser'>
               ${retweetText}
               </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName' >${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            <div>${replyFlag}</div>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button  data-bs-toggle="modal" data-bs-target="#replyModal">
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweet'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                            <button class='likeButton'>
                            <i class='far fa-heart'></i>
                            <span>${postData.likes.length}</span>
                              </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {

        if (elapsed / 1000 < 30) {

            return "Just now";
        }

        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}