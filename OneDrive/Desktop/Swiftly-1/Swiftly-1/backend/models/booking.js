// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   parkingId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Parking',
//   },
//   startTime: Date,
//   endTime: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'truck'],
    required: true,
  },
  startTime: {
    type: String, // stored as "HH:MM" e.g. "14:30"
    required: true,
  },
  endTime: {
    type: String, // stored as "HH:MM" e.g. "16:30"
    required: true,
  },
  duration: {
    type: Number, // in hours e.g. 2.5
    required: true,
  },
  totalCost: {
    type: Number, // in rupees e.g. 100
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);