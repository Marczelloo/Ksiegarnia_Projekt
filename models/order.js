class Order {
      constructor(id, user, cart, date, total, discountTotal, status) {
            this.id = id;
            this.user = user;
            this.cart = cart;
            this.date = date;
            this.total = total;
            this.discountTotal = discountTotal;
            this.status = status;
      }

      get_id() {
            return this.id;
      }

      get_user() {
            return this.user;
      }

      get_cart() {
            return this.cart;
      }

      get_date() {
            return this.date;
      }

      get_total() {
            return this.total;
      }

      get_discountTotal() {
            return this.discountTotal;
      }

      get_status() {
            return this.status;
      }

      set_id(id) {
            this.id = id;
      }

      set_user(user) {
            this.user = user;
      }

      set_cart(cart) {
            this.cart = cart;
      }

      set_date(date) {
            this.date = date;
      }

      set_total(total) {
            this.total = total;
      }

      set_discountTotal(discountTotal) {
            this.discountTotal = discountTotal;
      }

      set_status(status) {
            this.status = status;
      }
}