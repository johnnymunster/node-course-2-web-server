const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000 ;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

//Our middleware is keeping track with how our server is doing.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  //server.log is recording our logs...in this case our time stamps for when we go onto each page.
  //fs.appendFile lets us add a file.
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//Challenge - added maintenance.hbs to respond when being updated.

// app.use((req, res, next) => {
//   //this file will run as we didn't run next(); meaning no other code can be executed.
//   res.render('maintenance.hbs');
// });

//moved this line down so we can log our requests and check to see if we're in maintenance.
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the home page'
  });
});

app.get("/projects", (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

// /bad - send back json with errorMessage (little test)
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () =>{
  console.log(`Server is up on port ${port}`);
});
