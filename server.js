const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser= require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let authDB = JSON.parse(fs.readFileSync('auth.json'));
let tokenDB = JSON.parse(fs.readFileSync('token.json'));
let gameDB = JSON.parse(fs.readFileSync('game.json'));

console.log(authDB);
//console.log(tokenDB);
//console.log(gameDB);

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
  };

app.get('/', (req, res) => {
    res.render('index');
  });

app.post('/login', (req, res) => {
    if(authDB[req.body['email']]){
        if(authDB[req.body['email']] === req.body['password']){
            const tkn = uuidv4();
            tokenDB[tkn] = req.body['email'];
            fs.writeFileSync('token.json', JSON.stringify(tokenDB));
            res.send({status: "Success", token: tkn});
        } else {
            res.send({status: "Error"});
        }
    } else {
        res.send({status: "Error"});
    }
});

app.post('/register', (req, res) => {
    if(!authDB[req.body['email']]){
        if(req.body['cpassword'] === req.body['password']){
            const tkn = uuidv4();
            authDB[req.body['email']] = req.body['password'];
            tokenDB[tkn] = req.body['email'];
            fs.writeFileSync('auth.json', JSON.stringify(authDB));
            fs.writeFileSync('token.json', JSON.stringify(tokenDB));
            res.send({status: "Success", token: tkn});
        } else {
            res.send({status: "Error", message: "Incorrect Password"});
        }
    } else {
        res.send({status: "Error", message: "User is already taken."});
    }
});

app.post('/tcheck', (req, res) => {
    if(tokenDB[req.body['token']]){
        res.send({
            status: "Success",
            u_info: {
                token: req.body['token'],
                u_name: tokenDB[req.body['token']]
            }
        });
    } else {
        res.send({status: "Error"});
    }
});

app.post('/logout', (req, res) => {
    if(tokenDB[req.body['token']]){
        delete tokenDB[req.body['token']];
        console.log(tokenDB);
        fs.writeFileSync('token.json', JSON.stringify(tokenDB));
        res.send({status: "Success"});
    } else {
        res.send({status: "Error"});
    }
});


app.get('/menu', (req, res) => {
    res.render('menu');
})

app.get('/game', (req, res) => {
    res.render('game');
})

app.post('/game', (req, res) => {
    
});

app.get('/profile', (req, res) => {
    res.render('profile');
})

const port = 3000;
server.listen(process.env.PORT||port, () => {
    console.log(`listening on *:${port}`);
});