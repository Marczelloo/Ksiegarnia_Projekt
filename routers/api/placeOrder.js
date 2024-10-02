const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
   const { name, surname, street, city, postalCode, country, cardNumber, expirationDate, cvv, cardholderName } = req.body;

   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      
   }
})

module.exports = router;