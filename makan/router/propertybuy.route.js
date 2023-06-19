import express from "express";
const router = express.Router();

import { buyproperty, getbuylist, getUserbuylist, deleteUserbuylist } from "../controller/propertybuy.controller"

router.post("/property/buy", buyproperty)
router.get("/user/allbuylists", getbuylist)
router.get("/user/buy/get/:userID", getUserbuylist)
router.delete("/user/buy/delete/:userID", deleteUserbuylist)
export default router

