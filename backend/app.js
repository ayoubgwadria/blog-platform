var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const connectDB = require('./config/db');
const cors = require('cors');
var app = express();


app.use(cors({origin : 'http://localhost:4200'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


connectDB();

app.get('/api/health',(req,res)=>{
    res.json({status:'api ok'});
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));

module.exports = app;
