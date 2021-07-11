import React, {Component} from "react"
import { useParams } from "react-router-dom"
import {EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import axios from 'axios'
import '../../styles/textEditor.css'

function uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization', 'Client-ID ##clientid###');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          console.log(response)
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          console.log(error)
          reject(error);
        });
      }
    );
  }

class EditPostFromAdmin extends Component{
  
  componentWillMount() {
    if(!localStorage.getItem("userInfo")){
      this.props.history.push("/")
    }
  }

    state = {
        editorState: EditorState.createEmpty(),
        title: "",
        postId: ""
    }

    onEditorStateChange: Function = (editorState) => {
        this.setState({
          ...this.state,
          editorState
        })
        console.log(this.state)
      }

    handleTitleChange = (e) => {
      e.preventDefault()
      this.setState({
        ...this.state,
        title: e.target.value
      })
    }

    componentDidMount() {
        const postId = this.props.location.pathname.split('/')[2]

        axios.get(`/blog/getPost/${postId}`,{
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        }).then(result => this.setState({
            editorState: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(result.data.postData.content))),
            title: result.data.postData.title,
            postId: result.data.postData._id
        }))

    }

    savePost = async () => {

      const data = await draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        
      const title = this.state.title
      const postId = this.state.postId
      await axios.put(`/blog/editUserPostsFromAdmin/${postId}`, {data: data.toString(), title, postId},{
        headers: {
            'Authorization': `bearer ${localStorage.getItem("token")}`
        }
      })
    }

  render(){
    return (
        <div className='container' onLoad={this.getPost}>

            <label htmlFor="title">Title:</label>
            <input id="title" onChange={this.handleTitleChange} value={this.state.title}></input>

            <Editor
                editorState={this.state.editorState}
                value="lolooo"
                onEditorStateChange={this.onEditorStateChange}    
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } }
                }}
            />
            <button onClick={this.savePost}>Update post</button>
        </div>
    )}
}

export default EditPostFromAdmin
