const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const DB_Handler = require('../../models/db_handler');
const { CartItem } = require('../../models/cart');

router.post('/update', (req, res) => {
   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      const { title, quantity } = req.body;

      const cartItem = user.cart.items.find(item => item.book.title == title);
      if(cartItem)
      {
         cartItem.quantity = quantity;

         const cartPrice = user.calculate_cart_total();
         const discountPrice = cartPrice - user.apply_discount();
         const cartTotal = user.apply_discount();

         req.session.user = user.toJSON();
         res.json({ success: true, message: "Cart updated successfully!", cartPrice, discountPrice, cartTotal });
      }
      else
      {
         res.json({ success: false, errorMessage: "Book not found in cart!" });
      }
   }
   else
   {
      res.status(401).json({ success: false, errorMessage: "User not logged in!" });
   }
})

router.post('/remove', (req, res) => {
   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      const { title } = req.body;

      const cartItemIndex = user.cart.items.findIndex(item => item.book.title === title);
      if(cartItemIndex !== -1)
      {
         user.cart.items.splice(cartItemIndex, 1);

         const cartPrice = user.calculate_cart_total();
         const discountPrice = cartPrice - user.apply_discount();
         const cartTotal = user.apply_discount();

         req.session.user = user.toJSON();
         res.json({ success: true, message: "Book removed from cart successfully!", cartPrice, discountPrice, cartTotal });
      }
      else
      {
         res.json({ success: false, errorMessage: "Book not found in cart!" });
      }
   }
   else
   {
      res.status(401).json({ success: false, errorMessage: "User not logged in!" });
   }
})

router.post('/add', (req, res) => {
   const db_handler = new DB_Handler();
   const bookTitle = req.body.title;

   if (req.session.user) {
         db_handler.getBookByTitle(bookTitle)
         .then(book => {
            book.quantity = 1;
            const cartItem = new CartItem(book, 1);

            const user = User.fromSession(req.session.user);
            const existingCartItem = user.cart.items.find(item => item.book.get_title() === book.title);

            if (existingCartItem) 
            {
               existingCartItem.quantity += 1;
            } 
            else 
            {
               user.cart.addItem(cartItem);
            }

            const userJSON = user.toJSON();
            req.session.user = userJSON;

            res.json({ success: true, message: "Book added to cart successfully!" });
         })
         .catch(error => {
               if (error.message == "Book not found") {
                  db_handler.getMultiVolumeBookByTitle(bookTitle)
                     .then(book => {
                        const cartItem = new CartItem(book, 1);

                        const user = User.fromSession(req.session.user);
                        const existingCartItem = user.cart.items.find(item => item.book.get_title() === book.title);

                        if(existingCartItem)
                        {
                           existingCartItem.quantity += 1;
                        }
                        else
                        {
                           user.cart.addItem(cartItem);
                        }

                        const userJSON = user.toJSON();
                        req.session.user = userJSON;

                        res.json({ success: true, message: "Book added to cart successfully!" });
                     })
                     .catch(error => {
                           console.error(error);
                           res.json({ success: false, errorMessage: "There was problem with loading book! Please try again later!" });
                     });
               } 
               else 
               {
                  console.error(error);
                  res.json({ success: false, errorMessage: "There was problem with loading book! Please try again later!" });
               }
         });
   } 
   else 
   {
         res.status(401).json({ success: false, errorMessage: "You need to be logged in to add book to cart!" });
         return;
   }
});

module.exports = router;