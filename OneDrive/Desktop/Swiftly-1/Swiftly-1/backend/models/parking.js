const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: String,
  area: String,
  lat: Number,
  lng: Number,
  type: String,
  price: Number,
  hours: String,
  vehicles: [String],
  avail: Number,
  total: Number,
  rating: Number,
  features: [String],
});

module.exports = mongoose.model('Parking', parkingSchema);