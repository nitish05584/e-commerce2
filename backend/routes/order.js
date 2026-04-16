
const express = require("express")
const isAuth = require("../middlewares/isAuth")
const { newOrderCode, getAllOrders, getAllOrdersAdmin, getMyOrder, updateStatus, getStats, newOrderOnline, verifyPayment } = require("../controller/order")

const router = express.Router()


router.post("/order/new/cod",isAuth,newOrderCode)

router.get("/order/all",isAuth,getAllOrders)

router.get("/order/admin/all",isAuth,getAllOrdersAdmin)

router.get("/order/:id",isAuth,getMyOrder)

router.post("/order/:id",isAuth,updateStatus)

router.get("/stats",isAuth,getStats)

router.post("/order/new/online",isAuth,newOrderOnline)

router.post("order/verify/payment",isAuth,verifyPayment)



module.exports = router