const express = require('express');
const router = express.Router();
const DB_Handler = require('../../models/db_handler');
const md5 = require('md5');

router.post('/', (req, res) => {
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

module.exports = router;