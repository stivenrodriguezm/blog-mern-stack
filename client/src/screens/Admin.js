import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Loader from '../components/general/Loader'

const Admin = (props) => {
    if(!localStorage.getItem("userInfo")){
        props.history.push("/")
    }

    const [usersData, setUsersData] = useState(null)

    useEffect(()=>{
        axios.get("/auth/admin",{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        })
            .then(result => setUsersData(result.data.data))
    }, [])

    const editUser = async (e) => {
        e.preventDefault()
        const id = e.target.id 
    }
    const deleteUser = async (e) => {
        e.preventDefault()
        await axios.delete(`/auth/deleteUserFromAdmin/${e.target.id}`,{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        })
        window.location.reload()
    }


    return (
        <div className="container">
            <h3 className="adminPanelTitle">Users</h3>
            <div className="containerAdminTable">
                <table className="adminTable">
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Description</th>
                        <th>Posts</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                    {usersData ?
                        (usersData.map((usuario) =>(
                            <tr>
                                <td>{usuario._id}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.role}</td>
                                <td>Desc---</td>
                                <td><Link to={`/postsFromAdmin/${usuario._id}`}>▀</Link></td>
                                <td><Link to={`/editFromAdmin/${usuario._id}`}>▀</Link></td>
                                <td id={usuario._id} onClick={deleteUser}>X</td>
                            </tr>
                        ))
                        ) : (<Loader />)
                    }
                </table>
            </div>
        </div>
    )
}

export default Admin
/*
                <tr>
                    <td></td>
                    <td>Smith</td>
                    <td>50</td>
                </tr>*/