import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const AllPosts = () => {

    const [posts, setPosts] = useState({})

    useEffect( async () => {
        await axios.get("/blog/AllPosts")
            .then(res => setPosts(res.data.data))
    }, [])

    var html = ""

    return (
        <div className="container containerPostsVista">
            <h2>Posts</h2>
            {
            posts
                ? Object.values(posts).map(post => (
                    html = {__html: post.content},
                    console.log(html) ,
                    <Link to={`/post/${post._id}`} className="postVista">
                        <h4>Content:</h4>
                        <div>
                            <div dangerouslySetInnerHTML={html} />
                        </div>
                    </Link>
                ))
                : null
            }
        </div>
    )
}

export default AllPosts
