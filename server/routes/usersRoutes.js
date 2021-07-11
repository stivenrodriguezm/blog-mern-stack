const express = require('express')
const router = express.Router()
const userController = require('../controllers/userControllers')

//middleware
const {requireLogin} = require("../middleware/auth")
const {requireAdminAccount} = require("../middleware/admin")

router.post("/register", userController.register)
router.post("/login", userController.login)
router.delete("/deleteMyAccount", requireLogin, userController.deleteMyUser)
router.get("/data", requireLogin, userController.userData)
router.put("/edit", requireLogin, userController.editUser)

//admin
router.get("/admin", requireAdminAccount, userController.adminBasicData) //get all the users
router.get("/getUserFromAdmin/:id", requireAdminAccount, userController.getUserFromAdmin) 
router.get("/getUserPostsFromAdmin/:id", requireAdminAccount, userController.getUserPostsFromAdmin) 
router.put("/editUserFromAdmin/:id", requireAdminAccount, userController.editUserFromAdmin) 
router.delete("/deleteUserFromAdmin/:id", requireAdminAccount, userController.deleteUserFromAdmin) 


module.exports = router