import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Components and Screens
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/user/Register'
import Login from './components/user/Login'
import Profile from './components/user/Profile'
import EditProfile from './components/user/EditProfile'
import EditUser from './components/admin/EditUser'
import UserPosts from './components/admin/UserPosts'
import EditPostFromAdmin from './components/admin/EditPostFromAdmin'
import AllPosts from './components/posts/AllPosts'
import PostView from './components/posts/PostView'
import MyPosts from './components/posts/MyPosts'
import EditMyPost from './components/posts/EditMyPost'

import jwt_decode from "jwt-decode"

import Index from './screens/Index'
import Admin from './screens/Admin'
import NewPost from './screens/NewPost'

function App() {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if(localStorage.getItem("userInfo")){
      const token = localStorage.getItem("token")
      const decoded = jwt_decode(token)
      const date = decoded.exp
      const utc = new Date(parseInt(date)) // convert number to date
      const nowDate = Date.now()
  
      if(nowDate < date){
        localStorage.removeItem("userInfo")
        localStorage.removeItem("token")
      }
    }
  })



  return (
    <div className="App">
      <Router>
        <Header />

        <Route exact path="/" component={Index} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/posts" component={AllPosts} />
        <Route exact path="/post/:id" component={PostView} />

        <Route exact path="/admin" component={Admin} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route exact path="/editFromAdmin/:id" component={EditUser} />
        <Route exact path="/editPostFromAdmin/:id" component={EditPostFromAdmin} />
        <Route exact path="/postsFromAdmin/:id" component={UserPosts} />
        <Route exact path="/NewPost" component={NewPost} />
        <Route exact path="/MyPosts" component={MyPosts} />
        <Route exact path="/editMyPost/:id" component={EditMyPost} />

        <Footer />  
      </Router>
    </div>
  );
}

export default App;