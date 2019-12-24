// const express = require('express')
// const app = express();
// var server = require("http").createServer(app); 
// var io = require('socket.io').listen(server);



// app.listen(8000, () => {
//   console.log('Port Listening on Node Server')
// });


// app.get('/',function(req,res){
//     res.sendFile(__dirname + '/index.html'); 
// });

// io.sockets.on('connection',function(socket){
//     connections.push(socket);
//     console.log('Connected: %s sockets connected',connections.length);

 
  
    
// })


 
var express = require("express"); //Express
var bodyParser = require('body-parser')
var app = express();    //Initializing to APp
var server = require("http").createServer(app); //creating server
var io = require('socket.io').listen(server); //listening to server
var fs = require("fs");
const Joi = require('joi'); //used for validation



const books = [
  {title: 'Harry Potter', id: 1},
  {title: 'Twilight', id: 2},
  {title: 'Lorien Legacies', id: 3}
  ]





users=[];
connections=[];


server.listen(process.env.PORT || 3000);

console.log('Server Running');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Getting the resource of HTML file

// app.get('/',function(req,res){
// console.log(req);
// res.sendFile(__dirname + '/index.html'); 
// });

app.get('/listUsers', function (req, res) {
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     console.log( data );
     res.end( data );
  });
})

app.get('/', (req, res) => {
  res.send('Welcome');
  });

   
app.get('/api/books', (req,res)=> {
  res.send(books);
  });

  app.get('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
res.send(book);
});


app.post('/api/books', (req, res)=> {
 
  const { error } = validateBook(req.body);
  if (error){
  res.status(400).send(error.details[0].message)
  return;
  }
  const book = {
  id: books.length + 1,
  title: req.body.title
  };
  books.push(book);
  res.send(book);
  });
   
  //UPDATE Request Handler
  app.put('/api/books/:id', (req, res) => {
  const book = books.find(c=> c.id === parseInt(req.params.id));
  if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');
   
  const { error } = validateBook(req.body);
  if (error){
  res.status(400).send(error.details[0].message);
  return;
  }
   
  book.title = req.body.title;
  res.send(book);
  });
   
  //DELETE Request Handler
  app.delete('/api/books/:id', (req, res) => {
   
  const book = books.find( c=> c.id === parseInt(req.params.id));
  if(!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');
   
  const index = books.indexOf(book);
  books.splice(index,1);
   
  res.send(book);
  });
   
  function validateBook(book) {
  const schema = {
  title: Joi.string().min(3).required()
  };
  return Joi.validate(book, schema);
   
  }



// //Connection
// io.sockets.on('connection',function(socket){
//     connections.push(socket);
//     console.log('Connected: %s sockets connected',connections.length);

//     //Disconnect
//     socket.on('disconnect',function(data){
//         connections.splice(connections.indexOf(socket),1);
//     console.log('Disconnect: %s sockets connected',connections.length);
//     })

//     //Send Message
//     socket.on('send message',function(data){
//         console.log(data);
//         io.sockets.emit('new message',{msg: data});
//     })
    
// })