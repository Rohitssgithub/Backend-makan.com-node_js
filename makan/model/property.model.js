import mongoose from "mongoose";
import user from "../model/user.model"

const PropertySchema = new mongoose.Schema({
    i_want_to: {
        type: String
    },
    property_type: {
        type: String
    },
    city: { type: String },
    address: { type: String },
    bedroom: {
        type: Number
    },
    area: {
        type: String
    },
    no_bathrooms: {
        type: Number
    },
    no_balconies: {
        type: Number
    },
    expected_price: {
        type: String
    },
    booking_amout: {
        type: String
    },
    status: {
        type: String
    },
    transaction_type: {
        type: String
    },
    description: {
        type: String
    },
    amenities: [{
        type: String
    }],
    images: [{
        type: String
    }],
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
    }

})

export default mongoose.model("property", PropertySchema)