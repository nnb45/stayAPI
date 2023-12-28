const createError = require('http-errors');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const hotelRouter = require('./routes/hotels');
const hotelDetailRouter = require('./routes/hotelsdetail');
const roomRouter = require('./routes/rooms');
const billRoutes = require('./routes/bill');

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const jwt = require('jsonwebtoken'); // Sử dụng thư viện jsonwebtoken

const your_jwt_secret_key = process.env.JWT_SECRET_KEY; // Lấy khóa từ biến môi trường

// Bây giờ bạn có thể sử dụng your_jwt_secret_key để tạo và xác minh JWT

// database connect
mongoose.connect("mongodb+srv://giangca2612:wyipY9kAQbBhmdzZ@bookingapp.s5ykpwz.mongodb.net/?retryWrites=true&w=majority", {

})
  .then(() => {
    console.log(">>>>>>>>>> MongoDB Connnected!!!!!!!");
  })
  .catch(err => {
    console.log("Connect Error!", err);
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', hbs.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/hoteldetail', hotelDetailRouter);
app.use('/api/room', roomRouter);
app.use('/api/bill', billRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
