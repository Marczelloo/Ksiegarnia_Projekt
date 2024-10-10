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
         res.json({ success: true, message: 'User logged in successfully'})
      })
      .catch(error => {
         res.json({ success: false, errorMessage: error.message });   
      })
   }
   catch(error) {
      res.json({ success: false, errorMessage: error.message });   
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

router.post('/update/email', (req, res) => {
   const newEmail = req.body.email;
   const oldEmail = req.session.user.email;

   const db_handler = new DB_Handler();
   db_handler.updateEmail(newEmail, oldEmail)
   .then(() => {
      req.session.user.email = newEmail;
      res.json({ success: true, error: null, message: "Email changed successfully!"})
   })
   .catch(error => {
      console.error(error);
      res.json({ success: false, error: error.message})
   })
})

router.post('/update/username', (req, res) => {
   const newUsername = req.body.username;
   const email = req.session.user.email;

   const db_handler = new DB_Handler();
   db_handler.updateUsername(newUsername, email)
   .then(() => {
      req.session.user.username = newUsername;
      res.json({ success: true, error: null, message: "Username changed successfully!" })
   })
   .catch(error => {
      console.error(error);
      res.json({ success: false, error: error.message })
   })

})

router.post('/update/password', (req, res) => {
   const newPassword = req.body.password;
   const email = req.session.user.email;  

   const hashedPassword = md5(newPassword);

   const db_handler = new DB_Handler();
   db_handler.updatePassword(hashedPassword, email)
   .then(() => {
      req.session.user.password = hashedPassword;
      res.json({ success: true, error: null, message: "Password changed successfully!"})
   })
   .catch(error => {
      console.error(error);
      res.json({ success: false, error: error.message })
   })
})

module.exports = router;