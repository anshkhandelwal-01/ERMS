const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const expressEjsLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieparser());
app.use(express.static('./assets'));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressEjsLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'ERMS',
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/ERMS_development',
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`The server is running on the port: ${port}`);
})