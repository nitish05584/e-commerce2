
const express = require("express")
const isAuth = require("../middlewares/isAuth")
const { addAddress, getAllAddress, getSingleAddress, deleteAddress } = require("../controller/address")


const router = express.Router()


router.post("/address/new",isAuth,addAddress)

router.get("/address/all",isAuth,getAllAddress)

router.get("/address/:id",isAuth,getSingleAddress)

router.delete("/address/:id",isAuth,deleteAddress)



module.exports = router