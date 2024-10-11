const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const DB_Handler = require('../../models/db_handler');
const { CartItem } = require('../../models/cart');

router.post('/update', async (req, res) => {
   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      const { title, quantity } = req.body;

      const cartItem = user.cart.items.find(item => item.book.title == title);
      if(cartItem)
      {
         const db_handler = new DB_Handler();
         
         const bookQuantity = await db_handler.getBookQuantity(title); 

         if(quantity <= bookQuantity)
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
            res.json({ success: false, errorMessage: "Not enough books in stock!" });
         }
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
   const quantity = req.body.quantity;

   console.log(bookTitle, quantity);

   if (req.session.user) {
         db_handler.getBookByTitle(bookTitle)
         .then(async book => {
            book.quantity = quantity;
            const cartItem = new CartItem(book, quantity);

            const user = User.fromSession(req.session.user);
            const existingCartItem = user.cart.items.find(item => item.book.get_title() === book.title);

            if (existingCartItem) 
            {
               const bookQuantity = await db_handler.getBookQuantity(bookTitle)
               const newQuantity = existingCartItem.quantity + 1;

               if(newQuantity <= bookQuantity)
               {
                  existingCartItem.quantity = newQuantity;
               }
               else
               {
                  res.json({ success: false, errorMessage: "Not enough books in stock!" });
                  return;
               }
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
                        const cartItem = new CartItem(book, quantity);

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