class ShippingDetails {
   constructor(name, surname, street, city, postalCode, country) 
   {
      this.name = name;
      this.surname = surname;
      this.street = street;
      this.city = city;
      this.postalCode = postalCode;
      this.country = country;
   }

   get_name() 
   {
      return this.name;
   }

   get_surname() 
   {
      return this.surname;
   }

   get_street() 
   {
      return this.street;
   }

   get_city() 
   {
      return this.city;
   }

   get_postalCode() 
   {
      return this.postalCode;
   }

   get_country() 
   {
      return this.country;
   }
}

module.exports = ShippingDetails;