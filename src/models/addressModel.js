class Address {
    constructor(id, userId, house, street, pincode, createdAt, isDefault) {
      this.id = id;
      this.userId = userId;
      this.house = house;
      this.street = street;
      this.pincode = pincode;
      this.createdAt = createdAt;
      this.isDefault = isDefault;
    }
  }
  
  module.exports = Address;
  