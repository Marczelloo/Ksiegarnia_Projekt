const { Book, MultiVolumeBook } = require('./Book');
const DB = require('./db');
const PaymentDetails = require('./paymentDetails');
const ShippingDetails = require('./shppingDetails');
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
                  if(results.length === 0) 
                  {
                     reject(new Error('User not found'));
                     return;
                  }
                  else
                  {
                     const user = new User(results[0].username, results[0].email, results[0].password);
                     resolve(user);

                  }                  
               }
            })
         })
      }

      async placeOrder(user, shippingDetails, paymentDetails, cartItems, date, total) {
         if(!user) throw new Error('User is missing');
         if(!shippingDetails) throw new Error('Shipping details are missing');
         if(!paymentDetails) throw new Error('Payment details are missing');
         if(!cartItems) throw new Error('Cart items are missing');
         if(!date) throw new Error('Date is missing');
         if(!total) throw new Error('Total is missing');

         if(!(user instanceof User)) throw new Error('User must be an instance of User');
         if(!(shippingDetails instanceof ShippingDetails)) throw new Error('Shipping details must be an instance of ShippingDetails');
         if(!(paymentDetails instanceof PaymentDetails)) throw new Error('Payment details must be an instance of PaymentDetails');
         if(!Array.isArray(cartItems)) throw new Error('Cart items must be an array');
         if(typeof date !== 'string') throw new Error('Date must be a string');
         if(typeof total !== 'number') throw new Error('Total must be a number');

         if(date.length < 3) throw new Error('Date is too short');
         if(date.length > 50) throw new Error('Date is too long');

         const userId = await new Promise((resolve, reject) => {
            this.db.connection.query('SELECT id FROM users WHERE email = ?', [user.email], (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               resolve(results[0].id);               
            });
         })

         const shippingDetailsId = await new Promise((resolve, reject) => {
            this.db.connection.query('INSERT INTO shippingdetails (user_id, name, surname, street, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, shippingDetails.name, shippingDetails.surname, shippingDetails.street, shippingDetails.city, shippingDetails.postalCode, shippingDetails.country], (error, results) => {
               if(error) 
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               resolve(results.insertId);
            });
         });

         const paymentDetailsId = await new Promise((resolve, reject) => {
            this.db.connection.query('INSERT INTO paymentdetails (user_id, card_number, expiration_date, cvv, cardholder_name) VALUES (?, ?, ?, ?, ?)', [userId, paymentDetails.cardNumber, paymentDetails.expirationDate, paymentDetails.cvv, paymentDetails.cardholderName], (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               resolve(results.insertId);
            });
         });

         const orderId = await new Promise((resolve, reject) => {
            this.db.connection.query(
               'INSERT INTO orders (customerId, shippingDetailsId, paymentDetailsId, orderDate, totalAmount) VALUES (?, ?, ?, ?, ?)',
               [userId, shippingDetailsId, paymentDetailsId, date, total],
               (error, results) => {
                  if (error) {
                     console.error('Error inserting into orders table:', error.message, error.code);
                     return reject(new Error('Failed to create the order: ' + error.message));
                  }
                  
                  if (!results || !results.insertId) {
                     return reject(new Error('No insertId returned after inserting the order.'));
                  }
                  
                  resolve(results.insertId);
               }
            );
         });

         for(let i = 0; i < cartItems.length; i++)
         {
            try
            {
               await this.db.connection.query('SELECT id FROM book WHERE title = ?', [cartItems[i].book.title], 
               async (error, results) => {
                  if(error)
                  {
                     if (error.code === 'ER_BAD_DB_ERROR') throw new Error('Database does not exist.');
                     else if (error.code === 'ER_PARSE_ERROR') throw new Error('SQL query syntax error.');
                     else if (error.code === 'ER_ACCESS_DENIED_ERROR') throw new Error('Access denied for user to database.');
                     else throw new Error('An unknown error occurred.' + error);
                  }

                  if(results.length === 0)
                  {
                     try
                     {
                        await this.db.connection.query('SELECT id FROM multivolumebook WHERE title = ?', [cartItems[i].book.title],
                        (error, results) => {
                           if(error)
                           {
                              if (error.code === 'ER_BAD_DB_ERROR') throw new Error('Database does not exist.');
                              else if (error.code === 'ER_PARSE_ERROR') throw new Error('SQL query syntax error.');
                              else if (error.code === 'ER_ACCESS_DENIED_ERROR') throw new Error('Access denied for user to database.');
                              else throw new Error('An unknown error occurred.' + error);
                           }

                           if(results.length === 0) throw new Error('Book not found');
                           else
                           {
                              this.db.connection.query('INSERT INTO orderItem (orderId, bookId, multiVolumeBookId, quantity, price) VALUES(?, ?, ?, ?, ?)', [orderId, null, results[0].id, cartItems[i].quantity, cartItems[i].book.price], (error, results) => {
                                 if(error)
                                 {
                                    if (error.code === 'ER_BAD_DB_ERROR') throw new Error('Database does not exist.');
                                    else if (error.code === 'ER_PARSE_ERROR') throw new Error('SQL query syntax error.');
                                    else if (error.code === 'ER_ACCESS_DENIED_ERROR') throw new Error('Access denied for user to database.');
                                    else throw new Error('An unknown error occurred.' + error);
                                 }
                              });
                           }
                        })
                     }
                     catch(error)
                     {
                        console.error(error);
                        throw new Error('Error inserting into orderItem table: ' + error.message);
                     }
                  }
                  else
                  {
                     this.db.connection.query('INSERT INTO orderItem (orderId, bookId, multiVolumeBookId, quantity, price) VALUES(?, ?, ?, ?, ?)', [orderId, results[0].id, null, cartItems[i].quantity, cartItems[i].book.price], (error, results) => {
                        if(error)
                        {
                           if (error.code === 'ER_BAD_DB_ERROR') throw new Error('Database does not exist.');
                           else if (error.code === 'ER_PARSE_ERROR') throw new Error('SQL query syntax error.');
                           else if (error.code === 'ER_ACCESS_DENIED_ERROR') throw new Error('Access denied for user to database.');
                           else throw new Error('An unknown error occurred.' + error);
                        }
                     });
                  }
               })
            }
            catch(error)
            {
               console.error(error);
               throw new Error('Error inserting into orderItem table: ' + error.message);
            }
         }
      } 

      async getBookQuantity(title)
      {
         if(!title) throw new Error('Book title is missing ');

         if(typeof title !== 'string') throw new Error('Book title must be a string');

         if(title.length < 3) throw new Error('Book title is too short');
         if(title.length > 50) throw new Error('Book title is too long');

         return new Promise((resolve, reject) => {
            this.db.connection.query('SELECT quantity FROM book WHERE title = ?', [title], (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }
               
               if(results.length === 0) reject(new Error('Book not found'))
               {
                  this.db.connection.query('SELECT quantity FROM multivolumebook WHERE title = ?', [title], (error, results) => {
                     if(error)
                     {
                        if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                        else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                        else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                        else reject(new Error('An unknown error occurred.' + error));
                     }

                     if(results.length === 0) reject(new Error('Book not found'));
                  });
               }
            });
         });
      }

      async getCategories()
      {
         return new Promise((resolve, reject) => {
            this.db.connection.query('SELECT name FROM category', (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }

               const categories = results.map(row => row.name);

               resolve(categories);
            })
         })
      }

      async getSubcategories()
      {
         return new Promise((resolve, reject) => {
            this.db.connection.query('SELECT name FROM subcategory', (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }

               const subcategories = results.map(row => row.name);
            
               resolve(subcategories);
            })
         })
      }

      async getAllProductsByCategory(category)
      {
         if(!category) throw new Error('Category is missing');

         if(typeof category !== 'string') throw new Error('Category must be a string');

         if(category.length < 3) throw new Error('Category is too short');

         const allBooks = await this.getAllProducts();

         return allBooks.filter(book => book.category === category);
      }

      async getAllProductsBySubcategory(subcategory)
      {
         if(!subcategory) throw new Error('Subcategory is missing');

         if(typeof subcategory !== 'string') throw new Error('Subcategory must be a string');

         if(subcategory.length < 3) throw new Error('Subcategory is too short');

         const allBooks = await this.getAllProducts();

         return allBooks.filter(book => book.subcategory === subcategory);
      }

      async getBookQuantity(title)
      {
         if(!title) throw new Error('Book title is missing ');

         if(typeof title !== 'string') throw new Error('Book title must be a string');

         if(title.length < 3) throw new Error('Book title is too short');

         return new Promise((resolve, reject) => {
            this.db.connection.query("SELECT quantity FROM book WHERE title = ?", [title], (error, results) => {
               if(error)
               {
                  if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                  else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                  else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                  else reject(new Error('An unknown error occurred.' + error));
               }

               if(results.length === 0) reject(new Error('Book not found'));

               resolve(results[0].quantity);
            })
         })
      }

      async getOrderByUser(email) {
         if (!email) throw new Error('Email is missing');
         if (typeof email !== 'string') throw new Error('Email must be a string');
         if (email.length < 5) throw new Error('Email is too short');
         if (email.length > 50) throw new Error('Email is too long');
     
         return new Promise((resolve, reject) => {
             this.db.connection.query(`
                  SELECT * FROM orders
                  INNER JOIN users ON orders.customerId = users.id
                  WHERE users.email = ?`, [email], async (error, results) => {
                  if (error) {
                     if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                     else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                     else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                     else reject(new Error('An unknown error occurred.' + error));
                     return;
                  }
      
                  try 
                  {
                     const orders = await Promise.all(results.map(async row => {
                           const books = await new Promise((resolve, reject) => {
                              this.db.connection.query(`
                                 SELECT book.title, book.author, book.language, book.pages, category.name AS category, subcategory.name AS subcategory, orderItem.quantity
                                 FROM book
                                 INNER JOIN orderItem ON book.id = orderItem.bookId
                                 INNER JOIN category ON category.id = book.category
                                 INNER JOIN subcategory ON subcategory.id = book.subcategory
                                 WHERE orderItem.orderId = ?;
                              `, [row.orderId], (error, results) => {
                                 if (error) {
                                       if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                                       else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                                       else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                                       else reject(new Error('An unknown error occurred.' + error));
                                 } else {
                                       resolve(results);
                                 }
                              });
                           });
      
                           const multiVolumeBooks = await new Promise((resolve, reject) => {
                              this.db.connection.query(`
                                 SELECT multivolumebook.title, multivolumebook.author, multivolumebook.language, multivolumebook.pages, category.name AS category, subcategory.name AS subcategory, orderItem.quantity
                                 FROM multivolumebook
                                 INNER JOIN orderItem ON multivolumebook.id = orderItem.multiVolumeBookId
                                 INNER JOIN category ON multivolumebook.category = category.id
                                 INNER JOIN subcategory ON multivolumebook.subcategory = subcategory.id
                                 WHERE orderItem.orderId = ?;
                              `, [row.orderId], (error, results) => {
                                 if (error) {
                                       if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                                       else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                                       else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                                       else reject(new Error('An unknown error occurred.' + error));
                                 } else {
                                       resolve(results);
                                 }
                              });
                           });

                        const parsedDate = new Date(row.orderDate);
                        const formattedDate = `${parsedDate.getDate()} ${parsedDate.toLocaleString('default', { month: 'long' })} ${parsedDate.getFullYear()}`;
     
                        return {
                           id: row.id,
                           date: formattedDate,
                           total: row.totalAmount,
                           books,
                           multiVolumeBooks
                        };
                     }));
     
                     resolve(orders);
                 } 
                 catch (error) 
                 {
                     console.error('Error processing orders:', error);
                     reject(error);
                 }
             });
         });
     }

   async updateEmail(newEmail, oldEmail)
   {
      console.log(newEmail, oldEmail);

      return new Promise((resolve, reject) => {
         this.db.connection.query('SELECT * FROM users WHERE email = ?', [newEmail], (error, results) => {
            if(error)
            {
               if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
               else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
               else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
               else reject(new Error('An unknown error occurred.' + error));
            }

            if (results.length > 0) reject(new Error('User with this email already exists.'));
            else
            {
               this.db.connection.query('UPDATE users SET email = ? WHERE email = ?', [newEmail, oldEmail], (error, results) => {
                  if(error)
                  {
                     if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                     else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                     else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                     else reject(new Error('An unknown error occurred.' + error));
                  }

                  resolve(results);
               });
            }
         })
      })
   }

   async updateUsername(username, email)
   {
      return new Promise((resolve, reject) => {
         this.db.connection.query('UPDATE users SET username = ? WHERE email = ?', [username, email], (error, results) => {
            if(error)
            {
               if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
               else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
               else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
               else reject(new Error('An unknown error occurred.' + error));
            }

            resolve(results);
         });  
      })
   }

   async updatePassword(password, email)
   {
      return new Promise((resolve, reject) => {
         this.db.connection.query('UPDATE users SET password = ? WHERE email = ?', [password, email], (error, results) => {
            if(error)
            {
               if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
               else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
               else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
               else reject(new Error('An unknown error occurred.' + error));
            }

            resolve(results);
         });
         
      })
   }

   async resetPassword(email, password)
   {
      return new Promise((resolve, reject) => {
         this.db.connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if(error)
            {
               if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
               else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
               else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
               else reject(new Error('An unknown error occurred.' + error));
            }

            if(results.length === 0)
            {
               reject(new Error('User not found'));
               return;
            } 
            else
            {
               this.db.connection.query('UPDATE users SET password = ? WHERE email = ?', [password, email], (error, results) => {
                  if(error)
                  {
                     if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                     else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                     else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                     else reject(new Error('An unknown error occurred.' + error));
                     return;
                  }
   
                  resolve(results);
               });
            }
         });
      });
   }

   async deleteUser(email) {
      return new Promise((resolve, reject) => {
         this.db.connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) 
            {
               if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
               else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
               else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
               else reject(new Error('An unknown error occurred.' + error));
               return;
            }

            if (results.length === 0) 
            {
               reject(new Error('User not found'));
               return;
            }

            const user = results[0];

            try 
            {
               await this.db.connection.beginTransaction();

               await new Promise((resolve, reject) => {
                  this.db.connection.query('DELETE FROM orderitem WHERE orderId IN (SELECT orderId FROM orders WHERE customerId = ?)', [user.id], (error, results) => {
                      if (error) {
                          if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                          else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                          else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                          else reject(new Error('An unknown error occurred.' + error));
                          return;
                      }
                      resolve(results);
                  });
              });

               await new Promise((resolve, reject) => {
                  this.db.connection.query('DELETE FROM orders WHERE customerId = ?', [user.id], (error, results) => {
                     if (error) {
                           if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                           else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                           else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                           else reject(new Error('An unknown error occurred.' + error));
                           return;
                     }
                     resolve(results);
                  });
               });

               await new Promise((resolve, reject) => {
                  this.db.connection.query('DELETE FROM paymentdetails WHERE user_id = ?', [user.id], (error, results) => {
                     if (error) {
                           if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                           else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                           else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                           else reject(new Error('An unknown error occurred.' + error));
                           return;
                     }
                     resolve(results);
                  });
               });

               await new Promise((resolve, reject) => {
                  this.db.connection.query('DELETE FROM shippingdetails WHERE user_id = ?', [user.id], (error, results) => {
                     if (error) {
                           if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                           else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                           else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                           else reject(new Error('An unknown error occurred.' + error));
                           return;
                     }
                     resolve(results);
                  });
               });

               await new Promise((resolve, reject) => {
                  this.db.connection.query('DELETE FROM users WHERE id = ?', [user.id], (error, results) => {
                     if (error) {
                           if (error.code === 'ER_BAD_DB_ERROR') reject(new Error('Database does not exist.'));
                           else if (error.code === 'ER_PARSE_ERROR') reject(new Error('SQL query syntax error.'));
                           else if (error.code === 'ER_ACCESS_DENIED_ERROR') reject(new Error('Access denied for user to database.'));
                           else reject(new Error('An unknown error occurred.' + error));
                           return;
                     }
                     resolve(results);
                  });
               });

               await this.db.connection.commit();
               resolve({ success: true });
            } 
            catch (error) 
            {
               await this.db.connection.rollback();
               reject(error);
            }
         });
      });
   }
}

module.exports = DB_Handler;