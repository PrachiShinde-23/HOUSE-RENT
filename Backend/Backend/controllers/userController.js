const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

//////////for registering/////////////////////////////
const registerController = async (req, res) => {
  try {
    let granted = "";
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    if (req.body.type === "Owner") {
      granted = "ungranted";
      const newUser = new userSchema({ ...req.body, granted });
      await newUser.save();
    } else {
      const newUser = new userSchema(req.body);
      await newUser.save();
    }
    ///////////aur you can do this////////
    //     if (req.body.type === "Owner") {
    //       newUser.set("granted", "pending", { strict: false });
    //     }
    //////////////////// for this, then you need to remove strict keyword from schema//////////////////////
    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////for the login
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      // sameSite: "strict",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    })
    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

/////forgotting password
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await userSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    await updatedUser.save();
    return res.status(200).send({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////auth controller
const authController = async (req, res) => {
  console.log(req.body);
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    console.log(user);
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};
/////////get all properties in home
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties) {
      throw new Error("No properties available");
    } else {
      res.status(200).send({ success: true, data: allProperties });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};

///////////booking handle///////////////

// const bookingHandleController = async (req, res) => {
//   try {
//     const { propertyid } = req.params;
//     const { userDetails } = req.body;

//     // Get property from DB
//     const property = await propertySchema.findById(propertyid);

//     if (!property) {
//       return res.status(404).send({
//         success: false,
//         message: "Property not found",
//       });
//     }

//     const newBooking = new bookingSchema({
//       propertyId: property._id,
//       // userID: req.body.userId,
//        userID: req.userId,        // renter id from middleware
//       ownerID: property.ownerId,    // owner id from property
//       userName: userDetails.fullName,
//       phone: userDetails.phone,
//       bookingStatus: "pending",
//     });

//     await newBooking.save();

//     res.status(200).send({
//       success: true,
//       message: "Booking Successful",
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Booking failed",
//     });
//   }
// };


const bookingHandleController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const { userDetails } = req.body;

    // console.log("==== BOOKING DEBUG START ====");
    // console.log("REQ.USERID:", req.userId);
    // console.log("PROPERTY ID:", propertyid);

    const property = await propertySchema.findById(propertyid);

    // console.log("PROPERTY FOUND:", property);
    // console.log("PROPERTY OWNER ID:", property?.ownerId);
    // console.log("==== BOOKING DEBUG END ====");

    if (!property) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }

    const newBooking = new bookingSchema({
      propertyId: property._id,
      userID: req.userId,
      ownerID: property.ownerId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: "pending",
    });

    await newBooking.save();

    return res.status(200).send({
      success: true,
      message: "Booking Successful",
    });

  } catch (error) {
    console.log("🔥🔥🔥 BOOKING ERROR FULL:");
    console.log(error);
    console.log("ERROR MESSAGE:", error.message);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};





/////get all bookings for sing tenents//////
const getAllBookingsController = async (req, res) => {
  const { userId } = req.body;
  try {
    const getAllBookings = await bookingSchema.find();
    const updatedBookings = getAllBookings.filter(
      (booking) => booking.userID.toString() === userId
    );
    return res.status(200).send({
      success: true,
      data: updatedBookings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};


module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  getAllPropertiesController,
  authController,
  bookingHandleController,
  getAllBookingsController
};



