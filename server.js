const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const fs = require('fs');

const port = process.env.PORT || 2020;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use((req,res,next)=>{
    var now = new Date().toDateString();
    var log = `${req.method} request made to ${req.url}: ${now}`;
    
    fs.appendFile('server.log', log + '\n', (err)=>{
        console.log('Unable to log it to the console, find it in server.log!')
    });
    
    next();
    
});

app.use((req, res, next) => {
    var now = new Date().toDateString();
    
    res.render('maintenance', {
        pageTitle: 'Maintenance Mode',
        timeNow: now
    });
});

hbs.registerHelper('getCurrentYear', ()=> {
    return new Date().getFullYear()
});
hbs.registerHelper('capIt', (string) => {
    return string.toUpperCase();
});
hbs.registerHelper('siteName', ()=>{
    return 'DamiUIX'
});
hbs.registerHelper('latitude', ()=>{
    axios
        .get('http://maps.googleapis.com/maps/api/geocode/json?address=ibadan')
        .then((res)=>{
            return res.data.results[0].geometry.location.lat;
    })
        .catch((e)=>{
            if(e.errno === "ENOTFOUND"){
                return 'Server not found'
            }else{
                return e.message
            }
    });
});

app.get('/', (req, res) => {
    res.render('home', {
        pageTitle: 'Home',
        username: 'Andrew'
    });
});

app.get('/bad', (req, res) => {
    res.send(
        {
            errorMessage: 'Unable to handle request now'
        }
    );
});

app.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'About Us'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});