// const express = require('express');
// const router = express.Router();
// const Parking = require('../models/parking');
// const Booking = require('../models/booking');

// // GET all parking spots
// router.get('/', async (req, res) => {
//   const data = await Parking.find();
//   res.json(data);
// });

// // BOOK a spot
// router.post('/book', async (req, res) => {
//   const { parkingId, duration } = req.body;

//   const spot = await Parking.findById(parkingId);

//   if (!spot || spot.avail <= 0) {
//     return res.status(400).json({ message: "No slots available" });
//   }

//   // decrease availability
//   spot.avail -= 1;
//   await spot.save();

//   // create booking
//   const now = new Date();
//   const end = new Date(now.getTime() + duration * 60 * 60 * 1000);

//   const booking = await Booking.create({
//     parkingId,
//     startTime: now,
//     endTime: end,
//   });

//   res.json({ message: "Booked successfully", booking });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Parking = require('../models/parking');
const Booking = require('../models/booking');

// -------------------------------------------------------
// GET /api/parking
// Returns all parking spots
// -------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const data = await Parking.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parking spots' });
  }
});

// -------------------------------------------------------
// GET /api/parking/bookings
// Returns all bookings (useful for admin dashboard later)
// -------------------------------------------------------
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('parkingId', 'name area');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// -------------------------------------------------------
// POST /api/parking/book
// Body: { parkingId, userName, vehicleType, startTime, endTime, duration, totalCost }
// -------------------------------------------------------
router.post('/book', async (req, res) => {
  const { parkingId, userName, vehicleType, startTime, endTime, duration, totalCost } = req.body;

  // Basic validation
  if (!parkingId || !userName || !vehicleType || !startTime || !endTime || !duration || !totalCost) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the parking spot
    const spot = await Parking.findById(parkingId);

    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    if (spot.avail <= 0) {
      return res.status(400).json({ message: 'No slots available at this spot' });
    }

    // Check vehicle type is supported at this spot
    if (!spot.vehicles.includes(vehicleType)) {
      return res.status(400).json({ message: `This spot does not support ${vehicleType}` });
    }

    // Decrement availability
    spot.avail -= 1;
    await spot.save();

    // Save booking
    const booking = await Booking.create({
      parkingId,
      userName,
      vehicleType,
      startTime,
      endTime,
      duration,
      totalCost,
    });

    res.status(201).json({
      message: 'Booked successfully',
      booking,
      remainingSpots: spot.avail,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while booking' });
  }
});

module.exports = router;