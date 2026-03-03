// const mongoose = require("mongoose");

// const bookingModel = mongoose.Schema(
//   {
//     propertId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "propertyschema",
//     },
//     ownerID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//     userID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//     userName: {
//       type: String,
//       required: [true, "Please provide a User Name"],
//     },
//     phone: {
//       type: String,
//       required: [true, "Please provide a Phone Number"],
//     },
//     bookingStatus: {
//       type: String,
//       required: [true, "Please provide a booking Type"],
//     },
//   },
//   {
//     strict: false,
//   }
// );

// const bookingSchema = mongoose.model("bookingschema", bookingModel);

// module.exports = bookingSchema;


const mongoose = require("mongoose");

const bookingModel = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "propertyschema",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userschema",
    required: true,
  },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userschema",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: String,
    default: "pending",
  },
});

const bookingSchema = mongoose.model("bookingschema", bookingModel);

module.exports = bookingSchema;