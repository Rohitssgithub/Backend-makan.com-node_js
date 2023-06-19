import wishlistModel from "../model/wishlist.model";

export const addpropertyTolist = async (req, res) => {
    try {
        let data
        let saveData;
        const { property_id, userID } = req.body;
        const userwishlist = await wishlistModel.findOne({ userID: userID, property_id: property_id });

        if (userwishlist) {
            return res.status(200).json({
                message: "property already exists in user wishlist"
            })
        }

        else {
            data = new wishlistModel({
                property_id: property_id,
                userID: userID
            });
            saveData = await data.save();
        }

        if (saveData) {
            res.status(201).json({
                data: saveData,
                message: "successfully added property to your wishlist."
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

export const getwishlist = async (req, res) => {
    try {
        const getwish = await wishlistModel.find()
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

export const getUserwishlist = async (req, res) => {
    try {
        let ids = req.params.userID
        const data = await wishlistModel.find({ userID: ids });
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

export const deleteUserwishlist = async (req, res) => {
    try {
        let ids = req.params.userID
        const data = await wishlistModel.deleteMany({ userID: ids });
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

export const upDateUserwishlist = async (req, res) => {
    try {
        const { userID, property_id } = req.body

        const data = await wishlistModel.deleteOne({ userID: userID, property_id: property_id });

        if (data) {
            res.status(201).json({
                data: data,
                message: "user wishlist updated"
            })
        }
        else {
            res.status(400).json({ message: "Something went wrong." })
        }
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}