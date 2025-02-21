var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

const connectDB = require('./config/db');
const cors = require('cors');
const authRouter = require ('./routes/authRoutes')
const adminRoutes  = require('./routes/adminRoutes')
const articleRoutes = require('./routes/articleRoutes')
const helmet = require('helmet');
const commentRoutes = require('./routes/commentRoutes');
const rateLimiter = require('./middleware/rateLimiter');
const { setupCommentNamespace } = require('./sockets/comments');
var http = require('http');
var socketIo = require('socket.io');
const { setupArticleNamespace } = require('./sockets/article');


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST']
  }
});setupArticleNamespace
const commentNamespace = io.of('/comments');
setupCommentNamespace(commentNamespace);


const articleNamespace = io.of('/articles');
setupArticleNamespace(articleNamespace);
 
app.use(cors({origin : 'http://localhost:4200'}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(rateLimiter);

app.use('/api', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes );
app.use('/api/article',articleRoutes);
app.use('/api/comment', commentRoutes);

require('./server/wsServer');

connectDB();

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint non trouvé' });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;