class Book {
      constructor(title, author, price, language, condition, used_condition = null, quantity, category, subcategory = null, pages) {
            this.title = title;
            this.author = author;
            this.price = price;
            this.language = language;
            this.condition = condition;
            this.used_condition = used_condition;
            this.quantity = quantity;
            this.category = category;
            this.subcategory = subcategory
            this.pages = pages;
      }

      get_title() {
            return this.title;
      }

      get_author() {
            return this.author;
      }

      get_price() {
            return this.price;
      }

      get_language() {
            return this.language;
      }

      get_condition() {
            return this.condition;
      }

      get_quantity() {
            return this.quantity;
      }

      get_category() {
            return this.category;
      }

      get_subcategory() {
            return this.subcategory;
      }

      get_pages() {
            return this.pages;
      }

      set_title(title) {
            this.title = title;
      }

      set_author(author) {
            this.author = author;
      }

      set_price(price) {
            this.price = price;
      }

      set_language(language) {
            this.language = language;
      }

      set_condition(condition) {
            this.condition = condition;
      }

      set_quantity(quantity) {
            this.quantity = quantity;
      }

      set_category(category) {
            this.category = category;
      }

      set_subcategory(subcategory) {
            this.subcategory = subcategory;
      }

      set_pages(pages) {
            this.pages = pages;
      }

      static fromSession(sessionBook) {
            return new Book(
                  sessionBook.title,
                  sessionBook.author,
                  sessionBook.price,
                  sessionBook.language,
                  sessionBook.condition,
                  sessionBook.used_condition,
                  sessionBook.quantity,
                  sessionBook.category,
                  sessionBook.subcategory,
                  sessionBook.pages
            );
      }
    
      toJSON() {
            return {
                title: this.title,
                author: this.author,
                price: this.price,
                language: this.language,
                condition: this.condition,
                used_condition: this.used_condition,
                quantity: this.quantity,
                category: this.category,
                subcategory: this.subcategory,
                pages: this.pages
            };
      }
}

class MultiVolumeBook extends Book {
   constructor(title, author, price, language, condition, used_condition = null, quantity, category, subcategory = null, pages, volumes = null) {
      super(title, author, price, language, condition, used_condition, quantity, category, subcategory, pages);

      if(volumes !== null)
            this.volumes = volumes;
      else 
            this.volumes = [];

   }

   addVolume(volume) {
      if(volume instanceof Book) {
         this.volumes.push(volume);
      }
      else 
      {
         throw new Error('Volume must be an instance of Book');
      }
   }

   getVolume() {
      return this.volumes;
   }
}

const Condition = {
   NEW: 'new',
   USED: 'used'
}

const UsedCondition = {
   VERY_GOOD: 'very good',
   GOOD: 'good',
   DAMAGED: 'damaged'
}

const Language = {
      POLISH: 'polish',
      ENGLISH: 'english',
}

module.exports = { Book, MultiVolumeBook, Condition, UsedCondition, Language };