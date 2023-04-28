const jwt = require("jsonwebtoken");

const router = require("express").Router();

const { authenticateJWT } = require("../validators");

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../contollers");
const { multerUpload } = require("../services");

router
  .get("/services", authenticateJWT, getServices)
  .get("/services/:id", authenticateJWT, getService)
  .post("/services", authenticateJWT, multerUpload, createService)
  .put("/services/:id", authenticateJWT, updateService)
  .delete("/services/:id", authenticateJWT, deleteService)
  .get("/bookings", authenticateJWT, getBookings)
  .get("/bookings/:id", authenticateJWT, getBooking)
  .post("/bookings", authenticateJWT, createBooking)
  .put("/bookings/:id", authenticateJWT, updateBooking)
  .delete("/bookings/:id", authenticateJWT, deleteBooking);

module.exports = router;
