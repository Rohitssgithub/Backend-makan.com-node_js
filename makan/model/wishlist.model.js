import mongoose from "mongoose";
import user from "../model/user.model";
import property from "../model/property.model"

const WishListSchema = new mongoose.Schema({
    property_id: {
        type: String,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
    }
})

export default mongoose.model('wishlist', WishListSchema)