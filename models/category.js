class Category {
      constructor(name, parent = null) {
         this.name = name;
         this.parent = parent;
         this.subcategories = [];
         if(parent) {
            parent.subcategories.push(this);
         }
      }

      get_name() {
         return this.name;
      }

      get_parent() {
         return this.parent;
      }

      get_subcategories() {
         return this.subcategories;
      }

      set_name(name) {
         this.name = name;
      }

      set_parent(parent) {
         this.parent = parent;
      }

      set_subcategories(subcategories) {
         this.subcategories = subcategories;
      }
}

module.exports = Category;