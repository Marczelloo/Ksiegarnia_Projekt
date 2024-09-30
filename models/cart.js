const { Book } = require('./Book');

class CartItem {
   constructor(book, quantity) {
       this.book = book;
       this.quantity = quantity;
   }

   static fromSession(sessionCartItem) {
      const book = sessionCartItem.book ? Book.fromSession(sessionCartItem.book) : undefined;
      return new CartItem(book, sessionCartItem.quantity);
  }

   toJSON() {
      return {
          book: this.book ? this.book.toJSON() : undefined,
          quantity: this.quantity
      };
   }
}

class Cart {
   constructor(items) {
      this.items = items || [];
  }

   addItem(item) 
   {
      this.items.push(item);
   }

   removeItem(item) 
   {
      this.items = this.items.filter(cartItem => cartItem !== item);
   }

   modifyItem(item, quantity) 
   {
      for(let cartItem of this.items)
      {
         if(cartItem === item)
         {
            cartItem.quantity = quantity;
         }
      }
   }

   calculateTotal() {
      return this.items.reduce((total, item) => total + item.book.price * item.quantity, 0);  
   }

   appyDiscount() {
      let total = this.calculateTotal();

      if (total > 200) 
         return Math.round((total * 0.9) * 100) / 100;
      else if (total > 100) 
         return Math.round((total * 0.95) * 100) / 100;

      return Math.round(total * 100) / 100;
   }

   static fromSession(sessionCart) {
      const items = sessionCart.items.map(item => CartItem.fromSession(item));
      return new Cart(items);
  }

   toJSON() {
      return {
         items: this.items.map(item => item.toJSON())
      };
   }
}

module.exports = { Cart, CartItem };