import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";

import {
    addpropertyTolist, getwishlist, getUserwishlist,
    deleteUserwishlist, upDateUserwishlist
} from "../controller/wishlist.controller"


// add property to the specific user list 
router.post("/wishlist/property", addpropertyTolist)
// get wishlist of all users 
router.get("/user/allwishlists", getwishlist)
// get wishlist of specific user 
router.get("/user/wishlist/get/:userID", getUserwishlist)
// delete wishlist of specific user 
router.delete("/user/wishlist/delete/:userID", deleteUserwishlist)
// update wishlist of specific user 
router.patch("/wishlist/update", upDateUserwishlist)


export default router

