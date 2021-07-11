const Post = require("../models/BlogModel")
const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")

exports.newPost = async (req, res) => {

    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode._id

    const user = await User.findById(userId)

    const postHtmlData = Array(req.body.data)
    const newPost = new Post({
        content: postHtmlData[0],
        authorId: userId,
        author: user.name,
        title: req.body.title
    })
    console.log(newPost)
    await newPost.save()
    res.status(200).json({message: "Post successfully created"})
}

exports.getAllPosts = async (req, res) => {
    const postsData = await Post.find({})
    const data = postsData
    res.status(200).json({data: data})
}

exports.getPost = async (req,res) => {
    const url = req.url
    const splittedUrl = url.split("/")
    const id = splittedUrl[2]
    
    const postData = await Post.findById(id)
    console.log(postData)
    
    res.status(200).json({postData})
}

exports.getMyPosts = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode._id

    const userPosts = await Post.find({authorId:userId})
    res.status(200).json(userPosts)
}

exports.editMyPosts = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode._id

    const user = await User.findById(userId)
    const post = await Post.findById(req.body.postId)

    if(post.authorId === String(user._id)){

        const postHtmlData = req.body.data
        const dataList = postHtmlData.split("\n")
        var dataString = ""

        for(var i=0; i < dataList.length; i++){
            dataString += dataList[i]+"\n"
        }

        const data = {
            content: dataString,
            title: req.body.title
        } 

        const updatedPost = await Post.findByIdAndUpdate(post._id,{
            $set: data
        }, {new: true})

        console.log(updatedPost)
        res.status(200).json(updatedPost)
    }

}

exports.deleteMyPosts = async (req, res) => {
    console.log(`Deleting post with id: ${req.params.id}`)
    Post.findByIdAndDelete(req.params.id).then((result) => res.status(200).json({message: "Post deleted"}))
}

exports.editUserPostsFromAdmin = async (req,res) => {
    
    const {postId, data, title} = req.body

    const postHtmlData = data
    const dataList = postHtmlData.split("\n")
    var dataString = ""

    for(var i=0; i < dataList.length; i++){
        dataString += dataList[i]+"\n"
    }

    const dataUpdate = {
        content: dataString,
        title: title
    } 

    const updatedPost = await Post.findByIdAndUpdate(postId,{
        $set: dataUpdate
    }, {new: true})

    console.log(updatedPost)
    res.status(200).json(updatedPost)
}

exports.deleteUserPostFromAdmin = async (req,res) => {
    const postId = req.params.id
    await Post.findByIdAndDelete(postId)
    res.status(200).json({message: "Post successfully deleted"})
}