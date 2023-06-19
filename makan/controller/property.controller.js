import propertyModel from "../model/property.model";
import multer from "multer";
import fs from "fs"
import user from "../model/user.model"
import { toNamespacedPath } from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("uploadData/property")) {
            fs.mkdirSync("uploadData/property")
        }
        cb(null, './uploadData/property')
    },
    filename: function (req, file, cb) {
        const name = file.originalname;
        const extrarr = name.split('.');
        const ext = extrarr[extrarr.length - 1];
        extrarr.pop();
        const suff = Date.now();
        cb(null, extrarr + "-" + suff + "." + ext)
    }
})
const upload = multer({ storage: storage })

export const addproperty = async (req, res) => {
    try {

        const uploaddata = upload.array("image");
        uploaddata(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }
            const { i_want_to, property_type, city, address, bedroom, area, no_bathrooms, no_balconies, expected_price, booking_amout, status, transaction_type, description, amenities, userID } = req.body;
            let images = []
            req.files.forEach((ele) => {
                images.push(ele.filename)
            })
            const propertyData = new propertyModel({
                i_want_to: i_want_to,
                property_type: property_type,
                city: city,
                address: address,
                bedroom: bedroom,
                area: area,
                no_bathrooms: no_bathrooms,
                no_balconies: no_balconies,
                expected_price: expected_price,
                booking_amout: booking_amout,
                status: status,
                transaction_type: transaction_type,
                description: description,
                amenities: amenities,
                images: images,
                userID: userID
            })
            await propertyData.save()

            if (propertyData) {
                res.status(200).json({
                    property: propertyData,
                    message: "property Register",
                })
            }
            else {
                res.status(400).json({
                    message: "something went wrong"
                })
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getAllProperty = async (req, res) => {
    try {
        let selectfix;
        let sortfix;
        let datas;
        let allproperty
        let { listType, type, city, bedroom, skip, limit, select, sort, amenities, name, broker } = req.query;

        const queryObject = {}
        const p = {}
        if (listType) {
            queryObject.i_want_to = { $regex: listType, $options: "i" }
        }
        if (type) {
            queryObject.property_type = { $regex: type, $options: "i" }
        }
        if (city) {
            queryObject.city = { $regex: city, $options: "i" }
        }
        if (bedroom) {
            queryObject.bedroom = { $eq: bedroom }
        }
        if (amenities) {
            queryObject.amenities = { $elemMatch: { $regex: amenities, $options: "i" } }
        }
        if (select) {
            selectfix = select.split(",").join(" ");
        };
        if (sort) {
            sortfix = sort.split(",").join(" ");
        };
        let page = Number(req.query.page) || 1;
        skip = (page - 1) * limit;
        if (name) {
            p.path = 'userID',
                p.match = { name: name }
            console.log(p)
        }
        if (broker) {
            p.path = 'userID',
                p.match = { profiletype: broker }
            console.log(p)
        }
        if (Object.keys(p).length == 0) {
            datas = await propertyModel.find(queryObject).skip(skip)
                .limit(limit).select(selectfix).sort(sortfix).populate('userID')

        }
        else if (Object.keys(p).length == 0) {
            console.log('hi')
            allproperty = await propertyModel.find().skip(skip)
                .limit(limit).select(selectfix).sort(sortfix).populate(p)
            datas = allproperty.filter((e) => e.userID !== null)

        }

        else {
            allproperty = await propertyModel.find(queryObject).skip(skip)
                .limit(limit).select(selectfix).sort(sortfix).populate(p)
            datas = allproperty.filter((e) => e.userID !== null)
        }

        if (datas) {
            res.status(200).json({
                total: datas.length,
                property: datas,
                message: "property found",
            })
        }
        else {
            res.status(400).json({
                message: "something went wrong"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getAllPropertyUser = async (req, res) => {
    try {
        const allpropertyUser = await propertyModel.find({ userID: req.params.userID });
        if (allpropertyUser) {
            res.status(200).json({
                total: allpropertyUser.length,
                property: allpropertyUser,
                message: "user all property fetched",
            })
        }
        else {
            res.status(400).json({
                message: "something went wrong"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getSingleProperty = async (req, res) => {
    try {
        const Singleproperty = await propertyModel.findOne({ _id: req.params.id });
        if (Singleproperty) {
            res.status(200).json({
                property: Singleproperty,
                message: "user all property fetched",
            })
        }
        else {
            res.status(400).json({
                message: "something went wrong"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const deleteUserProperty = async (req, res) => {
    try {
        let ids = req.params.userID
        let propertyData = await propertyModel.find({ userID: ids })
        console.log(propertyData)
        propertyData.forEach((v) => {
            v.images.forEach((img) => {
                fs.unlink("./uploadData/userimage/" + img, async function (err) {
                    if (err) {
                        return res.status(400).json({ message: err })
                    }
                    console.log('Deleted succ')
                })
            })
        })
        const data = await property.deleteMany({ userID: ids })
        if (data) {
            res.status(200).json({
                data: data,
                message: "data deleted"
            })
        }
        else {
            res.status(400).json({
                message: "data not updated"
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const deleteProperty = async (req, res) => {
    try {
        let ids = req.params.userID
        let propertyData = await propertyModel.findOne({ _id: ids })
        propertyData.images.forEach((img) => {
            fs.unlink("./uploadData/property/" + img, async function (err) {
                if (err) {
                    return res.status(400).json({ message: err })
                }
                console.log('Deleted succ')
            })
        })
        const data = await property.deleteOne({ _id: ids })
        if (data) {
            res.status(200).json({
                data: data,
                message: "data deleted"
            })
        }
        else {
            res.status(400).json({
                message: "data not updated"
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const data = await user.find({ profiletype: 'agent' });
        if (data) {
            res.status(200).json({
                totoal: data.length,
                data: data,
                message: "All users data"
            })
        }
        else {
            res.status(400).json({
                message: "not found"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}