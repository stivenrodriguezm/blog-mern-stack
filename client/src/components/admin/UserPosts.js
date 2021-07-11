import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'

const UserPosts = (props) => {
    if(!localStorage.getItem("userInfo")){
        props.history.push("/")
    }

    const [userPosts, setUserPosts] = useState([])
    const [author, setAuthor] = useState("")
    const {id} = useParams() 

    useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem("userInfo"))
        axios.get(`/auth/getUserPostsFromAdmin/${id}`,{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        }).then(result => setUserPosts(result.data.userPosts))

        setAuthor(userData.name)
    }, [])

    console.log(userPosts)

    const deletePost = async (e) => {
        e.preventDefault()
        await axios.delete(`/blog/deleteUserPostFromAdmin/${e.target.id}`,{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        })
        window.location.reload()
    }

    return (
        <div className="container">
            <h3 className="adminPanelTitle">Posts from {author}</h3>
            <div className="containerAdminTable">
                <table className="adminTable">
                    <tr>
                        <th>Post id</th>
                        <th>title</th>
                        <th>created at</th>
                        <th>last update</th>
                        <th>category</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                    {userPosts
                        ? (userPosts.map((post) => (
                            <tr>
                                <td>{post._id}</td>
                                <td>{post.title}</td>
                                <td>{post.createdAt}</td>
                                <td>{post.updatedAt}</td>
                                <td>{post.category}</td>
                                <td><Link to={`/editPostFromAdmin/${post._id}`}>▀</Link></td>
                                <td><button onClick={deletePost} id={post._id}>X</button></td>
                            </tr>
                        )))
                        : null
                    }
                </table>
            </div>
        </div>
    )
}

export default UserPosts