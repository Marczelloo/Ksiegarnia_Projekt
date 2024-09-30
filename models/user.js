const { Cart } = require('./cart');

class User {
   constructor(username, email, password, cart) {
      this.username = username;
      this.email = email;
      this.password = password;
      this.cart = cart || new Cart();
  }

   get_username() {
      return this.username;
   }

   get_email() {
      return this.email;
   }

   get_password() {
      return this.password;
   }

   get_cart() {
      return this.cart;
   }

   set_username(username) {
      this.username = username;
   }

   set_email(email) {
      this.email = email;
   }

   set_password(password) {
      this.password = password;
   }

   set_cart(cart) {
      this.cart = cart;
   }

   add_to_cart(book) {
      this.cart.add_book(book);
   }

   remove_from_cart(book) {
      this.cart.remove_book(book);
   }

   modify_cart_item(book, quantity) {
      this.cart.modify_item(book, quantity);
   }

   calculate_cart_total() {
      return this.cart.calculateTotal();
   }

   apply_discount() {
      return this.cart.appyDiscount();
   }

   static fromSession(sessionUser) {
      const cart = Cart.fromSession(sessionUser.cart);
      return new User(sessionUser.username, sessionUser.email, sessionUser.password, cart);
  }

   toJSON() {
      return {
          username: this.username,
          email: this.email,
          password: this.password,
          cart: this.cart.toJSON()
      };
   }
}

module.exports = User;