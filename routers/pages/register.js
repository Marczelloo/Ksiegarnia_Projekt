const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   const logged = req.session.user ? true : false;

   if(logged)
   {
      res.redirect('/');
   }
   else
   {
      res.render('register');
   }

});

module.exports = router;