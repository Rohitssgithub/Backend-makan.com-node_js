import express from "express";
const router = express.Router();

import {
    addproperty, getAllProperty,
    getAllPropertyUser, getSingleProperty,
    deleteUserProperty, deleteProperty, getAllUsers
} from "../controller/property.controller"

// add  properties 
router.post("/add/property", addproperty)
// get all properties 
router.get("/get/property", getAllProperty)
// get all property of specific user 
router.get("/get/property/:userID", getAllPropertyUser)
// get specific property from website 
router.get("/get/single/property/:id", getSingleProperty)
// delete all property of user by userID
router.delete("/delete/user/property/:userID", deleteUserProperty)
// delete specific property by id 
router.delete("/delete/property/:id", deleteProperty)
// get all users on website 
router.get("/get/users", getAllUsers)

export default router

