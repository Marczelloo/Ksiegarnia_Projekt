class PaymentDetails {
   constructor(cardNumber, expirationDate, cvv, cardholderName) 
   {
      this.cardNumber = cardNumber,
      this.expirationDate = expirationDate,
      this.cvv = cvv,
      this.cardholderName = cardholderName
   }

   get_cardNumber() 
   {
      return this.cardNumber;
   }

   get_expirationDate() 
   {
      return this.expirationDate;
   }

   get_cvv() 
   {
      return this.cvv;
   }

   get_cardholderName() 
   {
      return this.cardholderName;
   }
}

module.exports = PaymentDetails;