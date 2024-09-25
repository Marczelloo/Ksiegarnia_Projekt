const { Book, MultiVolumeBook } = require('./Book');
const DB = require('./db');
const User = require('./user');

class DB_Handler {
      constructor() {
         this.db = new DB();
      }

      async getBooks() {
         return new Promise((resolve, reject) => {
            this.db.connection.query(`SELECT 
               book.title, 
               book.author, 
               book.price, 
               book.language, 
               book.book_condition, 
               book.used_condition, 
               book.quantity, 
               category.name AS category_name, 
               subcategory.name AS subcategory_name, 
               book.pages 
            FROM book 
            INNER JOIN category ON book.category = category.id 
            INNER JOIN subcategory ON book.subcategory = subcategory.id`, (error, results) => {
               if (error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else 
               {
                  const books = results.map(row => new Book(row.title, 
                     row.author, 
                     row.price,
                     row.language,
                     row.book_condition,
                     row.used_condition,
                     row.quantity,
                     row.category_name,
                     row.subcategory_name,
                     row.pages));
                  resolve(books);
               }
            });
         });
      }

      async getMultiVolumeBooks() {
         return new Promise((resolve, reject) => {
            this.db.connection.query(`SELECT
               multivolumebook.id,
               multivolumebook.title,
               multivolumebook.author,
               multivolumebook.price,
               multivolumebook.language,
               multivolumebook.book_condition,
               multivolumebook.used_condition,
               multivolumebook.quantity,
               category.name AS category_name,
               subcategory.name AS subcategory_name,
               multivolumebook.pages
            FROM multivolumebook
            INNER JOIN category ON multivolumebook.category = category.id
            INNER JOIN subcategory ON multivolumebook.subcategory = subcategory.id`, (error, results) => {
               if (error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else 
               {
                  if (results.length === 0 || !results[0]) {
                     return reject(new Error('Book not found'));
                 }
                 
                 const volumePromises = results.map(row => {
                     return this.getMultiVolumeBookVolumes(row.id)
                        .then(volumes => {
                           return new MultiVolumeBook(
                              row.title,
                              row.author,
                              row.price,
                              row.language,
                              row.book_condition,
                              row.used_condition,
                              row.quantity,
                              row.category_name,
                              row.subcategory_name,
                              row.pages,
                              volumes
                           );
                        })
                        .catch(error => {
                           console.error('Error fetching volumes for book ID:', row.id, error);
                           throw error;
                        });
                 });
                 
                  Promise.all(volumePromises)
                  .then(multivolumebooks => {
                     resolve(multivolumebooks);
                  })
                  .catch(error => {
                     console.error('Error resolving MultiVolumeBooks:', error);
                     reject(error);
                  });
               }
            });
         });
      }

      async getMultiVolumeBookVolumes(id) {
         if(!id) throw new Error('Book ID is missing ');

         if(isNaN(id)) throw new Error('Book ID must be a number');

         if(id < 0) throw new Error('Book ID must be a positive number');

         return new Promise((resolve, reject) => {
            this.db.connection.query(`SELECT 
               book.title,
               book.author,
               book.price,
               book.language,
               book.book_condition,
               book.used_condition,
               book.quantity,
               category.name AS category_name,
               subcategory.name AS subcategory_name,
               book.pages
            FROM multivolumebookvolumes 
            INNER JOIN book ON book.id = multivolumebookvolumes.book_id 
            INNER JOIN category ON book.category = category.id
            INNER JOIN subcategory ON book.subcategory = subcategory.id
            WHERE multivolumebookvolumes.multi_volume_book_id = ? `, [id], (error, results) => {
               if (error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else 
               {
                  if (results.length === 0 || !results[0]) {
                     return reject(new Error('Book not found'));
                  }
                  
                  const books = results.map(row => new Book(row.title,
                     row.author,
                     row.price,
                     row.language,
                     row.book_condition,
                     row.used_condition,
                     row.quantity,
                     row.category_name,
                     row.subcategory_name,
                     row.pages));
                  resolve(books);
               }
            })
         })
      }

      async getAllProducts() {
         return new Promise(async (resolve, reject) => {
            try 
            {
               const books = await this.getBooks();
               const multivolumebooks = await this.getMultiVolumeBooks();
               const products = [...books, ...multivolumebooks];
               for (let i = products.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [products[i], products[j]] = [products[j], products[i]];
               }
               resolve(products);
            } 
            catch (error) 
            {
               console.error(error);
               reject(error);
            }
         });
      }

      async getBookByTitle(title) {
         if(!title) throw new Error('Book title is missing ');

         if(typeof title !== 'string') throw new Error('Book title must be a string');

         if(title.length < 3) throw new Error('Book title is too short');
         if(title.length > 50) throw new Error('Book title is too long');

         return new Promise((resolve, reject) => {
            this.db.connection.query(`SELECT 
               book.title, 
               book.author, 
               book.price, 
               book.language, 
               book.book_condition, 
               book.used_condition, 
               book.quantity, 
               category.name AS category_name, 
               subcategory.name AS subcategory_name, 
               book.pages 
            FROM book 
            INNER JOIN category ON book.category = category.id 
            INNER JOIN subcategory ON book.subcategory = subcategory.id
            WHERE book.title = ?`, [title], (error, results) => {
               if (error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else 
               {
                  if (results.length === 0 || !results[0]) {
                     return reject(new Error('Book not found'));
                  }                  

                  const book = new Book(results[0].title,
                     results[0].author,
                     results[0].price,
                     results[0].language,
                     results[0].book_condition,
                     results[0].used_condition,
                     results[0].quantity,
                     results[0].category_name,
                     results[0].subcategory_name,
                     results[0].pages);
                  resolve(book);
               }
            })
         })
      }

      async getMultiVolumeBookByTitle(title) {
         if(!title) throw new Error('Book title is missing ');

         if(typeof title !== 'string') throw new Error('Book title must be a string');

         if(title.length < 3) throw new Error('Book title is too short');
         if(title.length > 50) throw new Error('Book title is too long');

         return new Promise((resolve, reject) => {
            this.db.connection.query(`SELECT
               multivolumebook.id,
               multivolumebook.title,
               multivolumebook.author,
               multivolumebook.price,
               multivolumebook.language,
               multivolumebook.book_condition,
               multivolumebook.used_condition,
               multivolumebook.quantity,
               category.name AS category_name,
               subcategory.name AS subcategory_name,
               multivolumebook.pages
            FROM multivolumebook
            INNER JOIN category ON multivolumebook.category = category.id
            INNER JOIN subcategory ON multivolumebook.subcategory = subcategory.id
            WHERE multivolumebook.title = ?`, [title], (error, results) => {
               if (error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else 
               {
                  if (results.length === 0 || !results[0]) {
                     return reject(new Error('Book not found'));
                  }

                  this.getMultiVolumeBookVolumes(results[0].id)
                  .then(volumes => {
                     const multivolumebook = new MultiVolumeBook(results[0].title,
                        results[0].author,
                        results[0].price,
                        results[0].language,
                        results[0].book_condition,
                        results[0].used_condition,
                        results[0].quantity,
                        results[0].category_name,
                        results[0].subcategory_name,
                        results[0].pages,
                        volumes);
                     resolve(multivolumebook);
                  })
                  .catch(error => {
                     console.error(error);
                     reject(error);
                  });
               }
            })
         });
      }

      async getBookById(id) {
         if(!id) throw new Error('Book ID is missing ');

         if(isNaN(id)) throw new Error('Book ID must be a number');

         if(id < 0) throw new Error('Book ID must be a positive number');

         return new Promise((resolve, reject) => {
            this.db.connection.query('SELECT * FROM books WHERE id = ?', [id], (error, results) => {
               if (error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else 
               {
                  if(results.length === 0) reject(new Error('Book not found'));
                  resolve(results[0]);
               }
            })
         })
      }

      async register(username, email, password) {
         if(!username) throw new Error('Username is missing');
         if(!email) throw new Error('Email is missing');
         if(!password) throw new Error('Password is missing');

         if(typeof username !== 'string') throw new Error('Username must be a string');
         if(typeof email !== 'string') throw new Error('Email must be a string');
         if(typeof password !== 'string') throw new Error('Password must be a string');

         if(username.length < 3) throw new Error('Username is too short');
         if(username.length > 50) throw new Error('Username is too long');

         if(email.length < 5) throw new Error('Email is too short');
         if(email.length > 50) throw new Error('Email is too long');

         if(password.length < 8) throw new Error('Password is too short');
         if(password.length > 50) throw new Error('Password is too long');

         return new Promise((resolve, reject) => {
            this.db.connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
               if (error) {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               } else {
                  if (results.length > 0) {
                     reject(new Error('User with this email already exists.'));
                  } else {
                     this.db.connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (error, results) => {
                        if (error) {
                           if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                           else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                           else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                           else reject(new Error('An unknown error occurred.' + error));
                        } else {
                           resolve(results);
                        }
                     });
                  }
               }
            });
         })
      }

      async login(email, password) {
         if(!email) throw new Error('Email is missing');
         if(!password) throw new Error('Password is missing')

         if(typeof email !== 'string') throw new Error('Email must be a string');
         if(typeof password !== 'string') throw new Error('Password must be a string');

         if(email.length < 5) throw new Error('Email is too short');
         if(email.length > 50) throw new Error('Email is too long');

         if(password.length < 8) throw new Error('Password is too short');
         if(password.length > 50) throw new Error('Password is too long');

         return new Promise((resolve, reject) => {
            this.db.connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               else
               {
                  if(results.length === 0) reject(new Error('User not found'));

                  console.log(results[0]);
                  
                  const user = new User(results[0].username, results[0].email, results[0].password);
                  resolve(user);
               }
            })
         })
      }


}

module.exports = DB_Handler;