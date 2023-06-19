import express from "express";
const router = express.Router();
import auth from "../middleware/auth"

import {
    signup, loginUser, updateUser, userData,
    addpProperty, getAllProperty, deleteProperty, getPropertyToBuy,
    getwishlist, addpropertylist, updateUserWlist, updateUserAddedProperty
} from "../controller/user.controller"

// register user 
router.post("/user/signup", signup)
// login user 
router.post("/user/login", loginUser)
// get login user data 
router.get("/user/data", auth, userData)
// update data of login user 
router.patch("/user/update", auth, updateUser)
// add property to login user 
router.post("/user/add/property", auth, addpProperty)
// get all property added by user 
router.get("/user/get/property", auth, getAllProperty)
// user can delete property added by self 
router.delete("/user/delete/property/:id", auth, deleteProperty)
// all properties available for buy 
router.get("/user/getall/property", getPropertyToBuy)
// wishlist of login user only
router.get("/user/allwishlist/get", auth, getwishlist)
// add property to wishlist after login only 
router.post("/user/wishlist/property", auth, addpropertylist)
// remove property from wishlist 
router.patch("/user/wishlist/update", auth, updateUserWlist)
// update property added by user for sale or rent 
router.patch("/user/property/update/:id", updateUserAddedProperty)
// logout user 
router.get("/user/logout", auth, (req, res) => {
    res.clearCookie('jwt', { path: '/' })
    res.status(200).send('user logout')
})

export default router

