import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import Loader from './general/Loader'

const Header = (props) => {
    const token = localStorage.getItem('token')
    var decodedToken=jwt.decode(token, {complete: true})
    var dateNow = new Date()
    
    const [isAdmin, setIsAdmin] = useState(false)

    const logout = async () => {
        await localStorage.removeItem('token')
        await localStorage.removeItem('userInfo')
        window.location.reload()
    }

    const findIfIsAdmin = async () => {
        if(token) {
            if(decodedToken.exp > dateNow.getTime()){
            } else {
                const data = await axios.get("/auth/data",{
                    headers: {
                        'Authorization': `bearer ${localStorage.getItem("token")}`
                    }
                })
                if(data.data.userInfo.role === 1){
                    setIsAdmin(true)
                }
            }
        }
    }
    findIfIsAdmin()

    return (
        <header>
            <nav id="header">
                <div className="header-left">
                    <Link to="/">Index</Link>
                    <Link to="/posts"> Posts</Link>
                </div>
                <div className="header-center">

                </div>
                <div className="header-right">
                    {isAdmin ? <Link to="/admin">Admin</Link> : <div></div>}
                    {token ? (decodedToken.exp < dateNow.getTime() ? <div></div> : <Link to="/MyPosts">My Posts</Link>) : <div></div>}
                    {token ? (decodedToken.exp < dateNow.getTime() ? <div></div> : <Link to="/NewPost">New Post</Link>) : <div></div>}
                    {token ? (decodedToken.exp < dateNow.getTime() ? <div></div> : <Link to="/profile"> Profile</Link>) : <div></div>}
                    {token ? (decodedToken.exp < dateNow.getTime() ? <div></div> : <Link onClick={logout}>Logout</Link>) : <div></div>}
                    {token ? (decodedToken.exp < dateNow.getTime() ? <div></div> : <div></div>) : <Link to="/register">Register</Link>}
                    {token ? (decodedToken.exp < dateNow.getTime() ? <div></div> : <div></div>) : <Link to="/login">Login</Link>}
                </div>
            </nav>
        </header>
    )
}

export default Header
