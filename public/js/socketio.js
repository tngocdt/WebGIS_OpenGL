// var socket = io.connect('http://localhost:1024');

// var line = document.getElementById('idLine');
// var model = document.getElementById('idModel');
// var btn = document.getElementById('send');
// var output = document.getElementById('output');

// btn.addEventListener('click',function(){
//   // alert('You clicked me!');
//   socket.emit('chat',{
//     message:message.value,
//     handle:handle.value
//   });
// });

// line.addEventListener('keypress',function(){
//   // alert('You clicked me!');
//   socket.emit('typing',handle.value);
// });

// socket.on('chat',function(data){
//   feedback.innerHTML = "";
//   output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>';
// });

// socket.on('typing',function(data){
//   feedback.innerHTML = '<p><em>' + data + ' is typing a message...' + '</em></p>';
// });