const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const DB_Handler = require('../../models/db_handler');
const md5 = require('md5');

router.post('/login', (req, res) => {
   const { email, password } = req.body;

   const hashedPassword = md5(password);

   try 
   {
      const db_handler = new DB_Handler();
      db_handler.login(email, hashedPassword)
      .then(user => {
         req.session.user = user;
         res.json({ message: 'User logged in successfully'})
      })
      .catch(error => {
         res.render('login_page', { error: error.message });
      })
   }
   catch(error) {
      res.render('login_page', { error: error.message });
   }
})

router.post('/register', (req, res) => {
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
      })
      .catch(error => {
         res.json({ error: error.message });
         console.error(error);
      })
   }
   catch(error) {
      res.json(({ error: error.message }));
      console.error(error);
   }
})

router.post('/logout', (req, res) => {
   try
   {
      req.session.destroy(err => {
         if(err)
         {
            console.error(err);
            res.status(500).send({ success: false, error: "Failed to log out!" });
         }
      })
      res.json({ success: true, message: 'User logged out successfully' });
   }
   catch(error)
   {
      console.error(error);
      res.status(500).send({ success: false, error: error });
   }
});

module.exports = router;