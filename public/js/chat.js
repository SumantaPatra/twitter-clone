const socket = io()
async function loadMsg() {
  const allmsg = await axios.get('/allmsg');
  for (let msg of allmsg.data) {
    const time = timeDifference(new Date(), new Date(msg.createdAt))
    $("#all-msg-container").append(
      `<li>
      <div class="chatcontainer">
      <span>${time}</span>
      <span>${msg.user}</span>
        <p>${msg.content}</p>
    </div>
      </li>`
    );
  }
}

loadMsg();
$('#msg-submit-btn').click(() => {
  const msg = $('#text-msg').val();
  socket.emit("send-msg", {
    user: currentUser,
    Msg: msg,
  });
  $("#text-msg").val("");
  location.reload();
})
socket.on('recived-msg', (data) => {
  $('#all-msg-container').append(`<li>
    <div>
          <span>${time}</span>
        </div>
    <span>${data.user}</span>
        <p>${data.content}</p>
    </li>`)

})