const express = require('express');
const app = express();
const path = require('path');
const mainRoute = require('./routers/pages/main.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user.js');
require('dotenv').config();

const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // Add this line to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: { 
      secure: false,
      maxAge: 60 * 60 * 1000
   }
}))

app.use((req, res, next) => {
   if(req.session.user)
   {
      req.user = new User(req.session.user.username, 
         req.session.user.email,
         req.session.user.password,
         req.session.user.cart
      );
   }
   next();
});

app.use('/', mainRoute);

//Page routes
let pageRoutes = [
   { path: '/register', route: require('./routers/pages/register.js') },
   { path: '/login', route: require('./routers/pages/login.js') },
   { path: '/cart', route: require('./routers/pages/cart.js') },
   { path: '/book', route: require('./routers/pages/book.js') },
   { path: '/checkout', route: require('./routers/pages/checkout.js') },
   { path: '/profile', route: require('./routers/pages/profile.js') },
   { path: '/resetPassword', route: require('./routers/pages/resetPassword.js') },
];

// API routes
let apiRoutes = [
   { path: '/api/cart', route: require('./routers/api/cart.js') },
   { path: '/api/checkout', route: require('./routers/api/checkout.js') },
   { path: '/api/filter', route: require('./routers/api/filter.js')},
   { path: '/api/book', route: require('./routers/api/book.js')}, 
   { path: '/api/user', route: require('./routers/api/user.js')},
];

pageRoutes.forEach(route => {
   app.use(route.path, route.route);
})

apiRoutes.forEach(route => {
   app.use(route.path, route.route);
})

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT} | http://localhost:${PORT}`);
})

// UWAGI: 
// - struktura danych
// - widoki ejs / pug
// - logowanie za pomoca ciasteczek / sesji
// - osobny router dla kazdej sciezki
// - zastanowic sie nad strukutra bazy danych
// - Initialize Node.js project with Express, MySQL/MariaDB, and other necessary libraries
// - Connect to the database
// - Create tables for books, users, orders, and categories
// - Implement user registration and login routes
// - Implement book routes
// - Implement order routes
// - Implement category routes
// - Implement error handling middleware
// - Implement discount logic in the create order route
// - Start the server