const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const app = express();
const port = 5001;
const mainRoutes = require('./routes/index');

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.use(express.static('public'));

app.use('/', mainRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
