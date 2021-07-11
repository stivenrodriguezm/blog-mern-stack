import React, {useEffect, useState} from 'react'
import { createBrowserHistory } from 'history'
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import axios from 'axios'

const PostView = (props) => {

    const [postData,setPostData] = useState("")
    const [deleted, setDeleted] = useState(false)
    const {id} = useParams()

    useEffect(() => {
        axios.get(`/blog/getPost/${id}`)
            .then(post => setPostData(post.data.postData))
        }, [])

    const html = {__html: postData.content}

    const localUser = JSON.parse(localStorage.getItem("userInfo"))

    const deleteMyPost = (e) => {
        e.preventDefault()

        const postId = e.target.name
        axios.delete(`/blog/deleteMyPost/${postId}`,{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
          }).then(res => console.log(res.data.message))
            .then(window.location.reload())
            .then(props.history.goBack())
    }

    return (
        <div className="container">
            <h3>{postData.title != "" ? postData.title : null}</h3>
            {postData.author != "" ? <p>Author: {postData.author}</p> : null}
            {localUser ? (localUser._id === postData.authorId ? <Link to={`/editMyPost/${postData._id}`}>Edit post</Link> :null) : null}
            {localUser ? (localUser._id === postData.authorId ? <button onClick={deleteMyPost} name={postData._id}> /Delete post</button> :null) : null}
            <br/>
            <div>
                <div dangerouslySetInnerHTML={html} />
            </div>
        </div>
    )
}

export default PostView
