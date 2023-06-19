import user from "../model/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import multer from "multer";
import fs from "fs"
import propertyModel from "../model/property.model";
import wishlistModel from "../model/wishlist.model";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("uploadData/userimage")) {
            fs.mkdirSync("uploadData/userimage")
        }
        cb(null, './uploadData/userimage')
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


const storages = multer.diskStorage({
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
const propertyImage = multer({ storage: storages })



// Register user
export const signup = async (req, res) => {
    try {

        const uploaddata = upload.single("image");
        uploaddata(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }
            const { name, age, gender, location, contact, profiletype, email, password, confirmPassword } = req.body;
            let existUser = await user.findOne({ email: email });
            if (existUser) {
                let userimage = req.file.filename
                if (req.file) {
                    fs.unlinkSync(`uploadData/userimage/${userimage}`)
                }
                return res.status(403).json({
                    message: 'User already exists'
                })
            }

            if (password !== confirmPassword) {
                let userimage = req.file.filename
                if (req.file) {
                    fs.unlinkSync(`uploadData/userimage/${userimage}`)
                }
                return res.status(403).json({
                    message: 'Password not matching'
                })
            }

            else {
                const image = req.file.filename;
                console.log(image)
                const hashPassword = await bcrypt.hashSync(password, 10);

                const userdata = new user({
                    name: name,
                    image: image,
                    age: age,
                    gender: gender,
                    location: location,
                    contact: contact,
                    profiletype: profiletype,
                    email: email,
                    password: hashPassword,
                })
                await userdata.save()

                if (userdata) {
                    res.status(200).json({
                        users: userdata,
                        message: "user Register",
                    })
                }
                else {
                    res.status(400).json({
                        message: "something went wrong"
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


// login user, generating token while login
export const loginUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const existuser = await user.findOne({ email: email })

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "please enter the details",
            })
        }

        if (!existuser) {
            return res.status(400).json({
                message: "user not found",
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "pass and confirmpass not matching",
            })
        }
        let matchpass = await bcrypt.compare(password, existuser.password);

        if (matchpass) {
            let token = await existuser.generateAuthToekn()
            res.cookie("jwt", token, {
                httpOnly: true,
            })
            // const token = jwt.sign({ _id: existuser._id, email: existuser.email }, 'test', { expiresIn: '1h' })
            return res.status(200).json({
                token: token,
                message: "login",
            })
        }
        else {
            return res.status(400).json({
                message: "invalid"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// Get user data using auth token
export const userData = async (req, res) => {
    try {
        const userData = await user.find({ _id: req.rootuser._id }).select('-password')
        if (userData) {
            res.status(200).json({
                data: userData,
                message: "user found",
            })
        }
        else {
            res.status(400).json({
                message: "user not found"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// profile update using auth token
export const updateUser = async (req, res) => {
    try {
        const uploadData = upload.single('image');
        uploadData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err })
            };
            let id = req.params.id
            const { name, age, gender, location, email, password } = req.body;
            const userdata = await user.findOne({ _id: req.rootuser._id });
            let image = userdata.image
            if (req.file) {
                image = req.file.filename
                fs.unlink("./uploadData/userimage/" + userdata.image, function (err) {
                    if (err) {
                        return res.status(400).json({ message: err })
                    }
                    console.log('Deleted succ')
                })
            }
            let hashPassword;
            if (password) {
                hashPassword = bcrypt.hashSync(password, 10)
            }

            const dataupdate = await user.updateOne({ _id: req.rootuser._id },
                {
                    $set: {
                        name: name,
                        image: image,
                        age: age,
                        gender: gender,
                        location: location,
                        email: email,
                        password: hashPassword,
                    }
                }
            )
            if (dataupdate) {
                return res.status(200).json({
                    message: 'Updated Successfully'
                })
            }
            else {
                return res.status(400).json({
                    message: 'not updated'
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


// delete user using auth token 
// export const deleteUser = async (req, res) => {
//     try {
//         let userdata = await user.findOne({ _id: req.user._id })

//         fs.unlink("./uploadData/userimage/" + userdata.image, async function (err) {
//             if (err) {
//                 return res.status(400).json({ message: err })
//             }
//             console.log('Deleted succ')
//             const data = await user.deleteOne({ _id: req.user._id })
//             if (data) {
//                 res.status(200).json({
//                     data: data,
//                     message: "data deleted"
//                 })
//             }
//             else {
//                 res.status(400).json({
//                     message: "data not updated"
//                 })
//             }
//         })

//     }
//     catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }



// add property for sell after login 


export const addpProperty = async (req, res) => {
    try {
        const uploaddata = propertyImage.array("images");
        uploaddata(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }
            console.log(req.files.filename)
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
                userID: req.rootuser._id
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


// get all property added by user for selling 
export const getAllProperty = async (req, res) => {
    try {
        const propertyData = await propertyModel.find({ userID: req.rootuser._id })
        if (userData) {
            res.status(200).json({
                data: propertyData,
                message: "user added this property",
                total: propertyData.length
            })
        }
        else {
            res.status(400).json({
                message: "user not found"
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
        let id = req.params.id
        let propertyData = await propertyModel.findOne({ userID: req.rootuser._id, _id: id })
        console.log(propertyData)
        propertyData.images.forEach((v) => {
            fs.unlink("./uploadData/property/" + v, async function (err) {
                if (err) {
                    return res.status(400).json({ message: err })
                }
                console.log('Deleted succ')
            })
        })
        const data = await property.deleteOne({ _id: id })
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

// get all property listed on website for selling so user can buy them

export const getPropertyToBuy = async (req, res) => {
    try {
        let selectfix;
        let sortfix;
        let { listType, type, city, bedroom, skip, limit, select, sort, amenities } = req.query;

        const queryObject = {}
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
            queryObject.bedroom = { $regex: bedroom }
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

        let allproperty = await propertyModel.find(queryObject).skip(skip).limit(limit).select(selectfix).sort(sortfix).populate('userID')

        const data = await allproperty;


        if (data) {
            res.status(200).json({
                total: data.length,
                property: data,
                message: "property fetched",
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

export const getwishlist = async (req, res) => {
    try {
        const getwish = await wishlistModel.find({ userID: req.rootuser._id }).populate('property_id')
        if (getwish) {
            res.status(201).json({
                total: getwish.length,
                data: getwish,
                message: "successfully fethced."
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

export const addpropertylist = async (req, res) => {
    try {
        const { property_id } = req.body;
        let existproperty = await wishlistModel.findOne({ userID: req.rootuser._id, property_id: property_id })
        if (existproperty) {
            return res.status(200).json({
                message: 'property already exist in user wishlist'
            })
        }
        let data = new wishlistModel({
            property_id: property_id,
            userID: req.rootuser._id
        });
        const saveData = await data.save();

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

export const updateUserWlist = async (req, res) => {
    try {
        const { property_id } = req.body
        const data = await wishlistModel.deleteMany({ userID: req.rootuser._id, property_id: property_id });
        if (data) {
            res.status(201).json({
                data: data,
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
export const updateUserAddedProperty = async (req, res) => {
    try {
        let dataupdate

        const uploadData = propertyImage.array("images");
        uploadData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err })
            };
            let propertyId = req.params.id
            const userdata = await propertyModel.findOne({ _id: propertyId });
            console.log(userdata)
            const { i_want_to, property_type, city, imgg, address, bedroom, area,
                no_bathrooms, no_balconies, expected_price, booking_amout, status,
                transaction_type, description, amenities } = req.body;

            if (req.files.length !== 0 && imgg) {
                imgg.split(' ').forEach(async (e) => {
                    console.log(e)
                    fs.unlink("./uploadData/property/" + e, function (err) {
                        if (err) {
                            return res.status(400).json({ message: err })
                        }
                        console.log('Deleted succ')
                    })
                    await propertyModel.updateOne({ _id: propertyId }, {
                        $pull: { images: e },
                        $set: {
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
                        }
                    })
                    req.files.forEach((async (i) => {
                        console.log(i)

                        await propertyModel.updateOne({ _id: propertyId }, {
                            $push: { images: i.filename }, $set: {
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
                            }
                        })
                    }))
                })

            }
            else if (req.files.length !== 0) {
                req.files.forEach((async (i) => {
                    console.log(i)

                    await propertyModel.updateOne({ _id: propertyId }, {
                        $push: { images: i.filename }, $set: {
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
                        }
                    })
                }))
            }
            else if (req.files.length == 0 && imgg) {
                imgg.split(' ').forEach(async (e) => {
                    console.log(e)
                    fs.unlink("./uploadData/property/" + e, function (err) {
                        if (err) {
                            return res.status(400).json({ message: err })
                        }
                        console.log('Deleted succ')
                    })
                    dataupdate = await propertyModel.updateOne({ _id: propertyId }, {
                        $pull: { images: e },
                        $set: {
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
                        }
                    })

                })
            }
            else {
                dataupdate = await propertyModel.updateOne({ _id: propertyId },
                    {
                        $set: {
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
                        }
                    }
                )
            }
            if (dataupdate) {
                return res.status(200).json({
                    message: 'Updated Successfully'
                })
            }
            else {
                return res.status(400).json({
                    message: 'not updated'
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