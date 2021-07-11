const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogControllers')

//middleware
const {requireLogin} = require("../middleware/auth")
const {requireAdminAccount} = require("../middleware/admin")

//routes
router.post("/newPost", requireLogin,blogController.newPost)
router.get("/AllPosts", blogController.getAllPosts)
router.get("/getPost/:id", blogController.getPost)
router.get("/myPosts", requireLogin, blogController.getMyPosts)
router.put("/editPost", requireLogin, blogController.editMyPosts)
router.delete("/deleteMyPost/:id", requireLogin, blogController.deleteMyPosts)

//admin
router.put("/editUserPostsFromAdmin/:id", requireAdminAccount, blogController.editUserPostsFromAdmin) 
router.delete("/deleteUserPostFromAdmin/:id", requireAdminAccount, blogController.deleteUserPostFromAdmin) 

module.exports = router