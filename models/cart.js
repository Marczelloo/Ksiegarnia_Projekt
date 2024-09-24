class CartItem {
   constructor(item, quantity) {
      this.item = item;
      this.quantity = quantity;
   }
}

class Cart {
   constructor() {
      this.items = [];
   }

   addItem(item, quantity) {
      if(quantity > book.quantity) {
         throw new Error('Not enough books in stock');
      }
      this.items.push(new CartItem(item, quantity));
   }

   removeItem(item) {
      this.items.push = this.items.filter(item => item.item !== item);
   }

   modifyItem(item, quantity) {
      for(let item of this.items) {
         if(item.item === item) {
            if(quantity > book.quantity) {
               throw new Error('Not enough books in stock');
            }
            item.quantity = quantity;
         }
      }
   }

   calculateTotal() {
      return this.items.reduce((total, item) => total + item.item.price * item.quantity, 0);
   }

   appyDiscount() {
      let total = this.calculateTotal();
      if(total > 200) {
         return total * 0.9;
      }
      else if(total > 100) {
         return total * 0.95;
      }

      return total;
   }
}

module.exports = Cart;