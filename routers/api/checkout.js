const express = require('express');
const User = require('../../models/user');
const ShippingDetails = require('../../models/shppingDetails');
const PaymentDetails = require('../../models/paymentDetails');
const DB_Handler = require('../../models/db_handler');
const router = express.Router();

router.post('/', (req, res) => {
   const { name, surname, street, city, postalCode, country, cardNumber, expirationDate, cvv, cardholderName } = req.body;

   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      const total = user.calculate_cart_total();
      

      if(total > 0)
      {
         const cart = user.cart;
         const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

         const cartItems = cart.getItems();

         const shippingDetails = new ShippingDetails(name, surname, street, city, postalCode, country);
         const paymentDetails = new PaymentDetails(cardNumber, expirationDate, cvv, cardholderName);

         const db_handler = new DB_Handler();

         db_handler.placeOrder(user, shippingDetails, paymentDetails, cartItems, date, total)
         .then(() => {
            user.clear_cart();
            req.session.user = user.toJSON();
            res.status(200).send({ success: true, message: 'Order placed successfully' });
         })
         .catch(error => {
            res.status(400).send({ success: false, message: error.message });
         })
      }
      else
      {
         res.status(400).send({ message: 'Cart is empty' });
      }
      
   }
})

module.exports = router;