import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MyPosts = (props) => {
    if(!localStorage.getItem("userInfo")){
        props.history.push("/")
    }

    const [myPosts, setMyPosts] = useState("")
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    useEffect(() => {
        axios.get(`/blog/myPosts`,{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
          }).then(result => setMyPosts(result.data))
    }, [])

    console.log(myPosts)
    var html = ""

    return (
        <div>
            <h3>My posts</h3>
            <div className="container containerPostsVista">
            {
                myPosts != "" ? (
                    myPosts.map(post => (
                        html = {__html: post.content},
                        <Link to={`/post/${post._id}`} className="postVista">
                            <h3>{post.title}</h3>
                            <div dangerouslySetInnerHTML={html} />
                        </Link>
                    ))
                    ) : null
            }
            </div>
        </div>
    )
}

export default MyPosts
