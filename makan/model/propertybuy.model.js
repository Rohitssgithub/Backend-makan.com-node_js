import mongoose from "mongoose";
import user from "../model/user.model";
import property from "../model/property.model"

const PropertyBuySchema = new mongoose.Schema({
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: property,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
    }
})

export default mongoose.model("propertyBuy", PropertyBuySchema)