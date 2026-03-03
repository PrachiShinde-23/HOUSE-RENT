const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");


const addPropertyController = async (req, res) => {
  try {
    console.log("🔥 Controller Hit");

    const newProperty = new propertySchema({
      propertyType: req.body.propertyType,
      propertyAdType: req.body.propertyAdType,
      propertyAddress: req.body.propertyAddress,
      ownerContact: req.body.ownerContact,
      propertyAmt: req.body.propertyAmt,
      additionalInfo: req.body.additionalInfo,
      // ownerId: req.body.userId,
      ownerId: req.userId,
      propertyImages: req.files.map(file => file.filename),
    });

    await newProperty.save();

    console.log("✅ Property Saved");

    res.status(200).send({
      success: true,
      message: "Property Added Successfully",
    });

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).send({
      success: false,
      message: "Error Adding Property",
    });
  }
};


///////////all properties of owner/////////
// const getAllOwnerPropertiesController = async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const getAllProperties = await propertySchema.find();
//     const updatedProperties = getAllProperties.filter(
//       (property) => property.ownerId.toString() === userId
//     );
//     return res.status(200).send({
//       success: true,
//       data: updatedProperties,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .send({ message: "Internal server error", success: false });
//   }
// };
// const getAllOwnerPropertiesController = async (req, res) => {
//   try {
//     const properties = await propertySchema.find({
//       ownerId: req.body.userId,
//     });

//     res.status(200).send({
//       success: true,
//       data: properties,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };




const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const ownerId = req.userId;  // ✅ from middleware

    const properties = await propertySchema.find({
      ownerId: ownerId,
    });

    return res.status(200).send({
      success: true,
      data: properties,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};









//////delete the property by owner/////
const deletePropertyController = async (req, res) => {
  const propertyId = req.params.propertyid;
  try {
    await propertySchema.findByIdAndDelete({
      _id: propertyId,
    });

    return res.status(200).send({
      success: true,
      message: "The property is deleted",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

//////updating the property/////////////
const updatePropertyController = async (req, res) => {
  const { propertyid } = req.params;
  console.log(req.body);
  try {
    const property = await propertySchema.findByIdAndUpdate(
      { _id: propertyid },
      {
        ...req.body,
        // ownerId: req.body.userId,
        ownerId: req.userId,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update property.",
    });
  }
};





const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await bookingSchema.find({
      // ownerID: req.body.userId,
      ownerID: req.userId, 
    });

    res.status(200).send({
      success: true,
      data: bookings,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching bookings",
    });
  }
};

//////////handle bookings status//////////////
const handleAllBookingstatusController = async (req, res) => {
  const { bookingId, propertyId, status } = req.body;
  try {
    const booking = await bookingSchema.findByIdAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: status,
      },
      {
        new: true,
      }
    );

    const property = await propertySchema.findByIdAndUpdate(
      { _id: propertyId },
      {
        isAvailable: status === 'booked' ? 'Unavailable' : 'Available', 
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: `changed the status of property to ${status}`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};
module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
};




