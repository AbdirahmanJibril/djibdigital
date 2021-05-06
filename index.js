require('dotenv').config()
import express from 'express';
const bodyParser = require("body-parser");
const https= require("https");
const path=require('path');
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const session = require('express-session');
const flash= require("express-flash");
import sslRedirect from 'heroku-ssl-redirect'; 

app.use(sslRedirect());
const port= process.env.PORT || 3000;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css',express.static('public/css'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use(session({
  secret: process.env.EMAIL_PASSW,
  resave: false,
  saveUninitialized: false
  
}));
app.use(flash());



app.get('/', (req,res)=>{
res.render('home',{message:req.flash('message')});
});
app.get('/cloud', (req,res)=>{
  res.render('cloud');
  });
app.get('/web', (req,res)=>{
res.render('web');
});
app.get('/digital', (req,res)=>{
res.render('digital');
});
app.get('/about', (req,res)=>{
res.render('about');
});
app.get('/contact', (req,res)=>{
res.render('contact',{message:req.flash('message')});
});

app.post('/email',(req,res)=>{
  
  const output = `
  <p>Enquiry Form</p>
  <h3>Contact detaill</h3>
  <ul>
  <li>First Name: ${req.body.first_name}</li>
  <li>Last Name: ${req.body.first_name}</li>
  <li>Phone: ${req.body.phone}</li>
  <li>Email: ${req.body.email}</li>
  <h3>Message</h3>
  <li>Message: <p>${req.body.textarea1}</p></li>
  
  
  `;
  const mailOptions = {
  
        to:'contact@djibdigital.com',
        from:'contact@djibdigital.com',
       subject: 'enquiry form',
       html:output
      
      };
    
 
    var smtpTransport = nodemailer.createTransport( {
      host: 'mail.privateemail.com',
       port: 587,
      secure: false,
       auth: {
      user: 'contact@djibdigital.com',
      pass: process.env.EMAIL_PASSW
  },
  tls: {
    
    rejectUnauthorized: false
  }
   
   
    });
    
    smtpTransport.sendMail(mailOptions, function(err,data) {
      if (err) {
        console.log(err);
      }else{
        req.flash('message', 'Thank you, we will be in touch shortly');
    res.render('contact',{message:req.flash('message'),  });
    }
    });
  

  
});








app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname +  "/404.html");
});





app.listen(port,function(){
    console.log("server is up and running");
  });

