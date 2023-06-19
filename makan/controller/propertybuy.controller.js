import propertybuyModel from "../model/propertybuy.model";

export const buyproperty = async (req, res) => {
    try {
        let data
        let saveData;
        const { property_id, userID } = req.body;
        const userPropertyBuy = await propertybuyModel.findOne({ userID: userID, property_id: property_id });

        if (userPropertyBuy) {
            return res.status(200).json({
                message: "property already exists in user buysection"
            })
        }

        else {
            data = new propertybuyModel({
                property_id: property_id,
                userID: userID
            });
            saveData = await data.save();
        }

        if (saveData) {
            res.status(201).json({
                data: saveData,
                message: "successfully added property in buy list"
            })
        }
        else {
            res.status(400).json({ message: "Something went wrong." })
        }
    }
    catch (err) {
        return resizeBy.status(400).json({
            message: err.message
        })
    }
}
export const getbuylist = async (req, res) => {
    try {
        const getwish = await propertybuyModel.find().populate({
            path: "property_id", model: propertybuyModel,
        })
        if (getwish.length > 0) {
            res.status(201).json({
                total: getwish.length,
                data: getwish,
                message: "all users wishlist"
            })
        }
        else {
            res.status(400).json({ message: "No wishlist available to fetched" })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getUserbuylist = async (req, res) => {
    try {
        let ids = req.params.userID
        const data = await propertybuyModel.find({ userID: ids });
        if (data) {
            res.status(201).json({
                data: data,
                message: "user buylist"
            })
        }
        else {
            res.status(400).json({ message: "Something went wrong." })
        }

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const deleteUserbuylist = async (req, res) => {
    try {
        let ids = req.params.userID
        const data = await propertybuyModel.deleteOne({ userID: ids });
        if (data) {
            res.status(201).json({
                data: data,
                message: "user wishlist"
            })
        }
        else {
            res.status(400).json({ message: "Something went wrong." })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}