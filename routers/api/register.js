const express = require('express');
const router = express.Router();
const DB_Handler = require('../../models/db_handler');
const md5 = require('md5');
const User = require('../../models/user');

router.post('/', (req, res) => {
   const { username, email, password } = req.body;

   const hashedPassword = md5(password);
   
   try
   {
      const db_handler = new DB_Handler();
      db_handler.register(username, email, hashedPassword)
      .then(row => {
         const user = new User(username, email, hashedPassword);
         req.session.user = user;
         res.json({ message: 'User registered successfully' });

         // res.cookie('user', JSON.stringify(user), { maxAge: 900000, httpOnly: true });
         // res.json({ message: 'User registered successfully', user });
      })
      .catch(error => {
         res.json({ error: error.message });
         console.error(error);
         //res.render('register', { error: error.message });
      })
   }
   catch(error) {
      res.json(({ error: error.message }));
      console.error(error);
      //res.render('register', { error: error.message });
   }
})

module.exports = router;