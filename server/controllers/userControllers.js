const User = require("../models/UserModel")
const Post = require("../models/BlogModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')

//register

exports.register = async(req,res) => {
    const {name, email, password} = req.body
    try {
        //buscar si no existe ya el usuario
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({error: "User already exists"})
        }

        //hash password
        const hashedpassword = await bcrypt.hash(password, 10)

        //create user and save
        const newUser = new User({
            name,
            email,
            password: hashedpassword
        })
        console.log(newUser)
        await newUser.save()
        res.status(200).json({message: "User successfully created"})
    } catch (error) {
       res.status(500).json(error) 
    }
}

exports.login = async (req,res) => {
    const {email, password} = req.body
    try {
        //find the user in the database
        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({message: "Wrong credentials"})
        } 

        //validate password
        const validated = await bcrypt.compare(password, user.password)
        if(!validated) 
            return res.status(402).json({message: "Wrong credentials"})

        //generate and send token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn:'24h'})
        return res.json({token}) //I must save it in localstorage in the front-end
    } catch (error) {
        console.log(error)
    }
}

exports.userData = async (req, res) => {
    try {
        //get Id from header
        const codedId = req.headers.authorization
        const decodedId = jwt_decode(codedId)
        const id = decodedId._id

        //get inf
        const userInfo = await User.findById(id).select("-password")

        //send info and status
        res.status(200).json({userInfo})
    } catch (error) {
        res.status(401).json({message: "Something happend"})
    }
}

exports.editUser = async (req, res) => {
    const {name, email, description, id} = req.body
    try {
        const user = await User.findByIdAndUpdate(id,{
            $set: req.body
        }, {new: true})
        //console.log(user)
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

exports.adminBasicData = async (req,res) => {
    const usersData = await User.find({})
    const data = usersData
    res.status(200).json({data: data})
}

exports.getUserFromAdmin = async (req,res) => {
    const url = req.url
    const splittedUrl = url.split("/")
    const id = splittedUrl[2]
    
    const userInfo = await User.findById(id).select("-password")
    
    res.status(200).json({userInfo})
}

exports.editUserFromAdmin = async (req,res) => {
    const {name, email, description, _id, rol} = req.body
    try {
        const user = await User.findByIdAndUpdate(_id,{
            $set: req.body
        }, {new: true})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

exports.deleteUserFromAdmin = async (req,res) => {
    const url = req.url
    const splittedUrl = url.split("/")
    const id = splittedUrl[2]

    await Post.deleteMany({authorId: id})
    await User.findByIdAndDelete(id)

    res.status(200).json({message: "User and its posts deleted successfully"})
}
exports.deleteMyUser = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decodedId = jwt_decode(token)
    const id = decodedId._id

    await Post.deleteMany({authorId: id})
    await User.findByIdAndDelete(id)

    res.status(200).json({message: "Account successfully deleted"})
}
exports.getUserPostsFromAdmin = async (req,res) => {
    const url = req.url
    const splittedUrl = url.split("/")
    const id = splittedUrl[2]
    
    const userPosts = await Post.find({authorId: id})

    console.log(id)
    console.log(userPosts)
    
    res.status(200).json({userPosts})
}