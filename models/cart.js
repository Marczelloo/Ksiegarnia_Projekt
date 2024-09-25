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

module.exports = { Cart, CartItem };