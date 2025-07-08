const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.APP_PORT || 3000
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const clientsRouter = require('./routes/clients');
app.use('/api/clients', clientsRouter);

const feedsRouter = require("./routes/feeds");
app.use("/api/feeds", feedsRouter);

const commentsRouter = require('./routes/comments');
app.use('/api/comments', commentsRouter);

const ratingsRouter = require("./routes/ratings");
app.use("/api/ratings", ratingsRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})