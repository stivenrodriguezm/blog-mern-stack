import React, {Component} from "react"
import {render} from 'react-dom'
import {EditorState, convertToRaw} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import axios from 'axios'
import '../styles/textEditor.css'

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

class NewPost extends Component{

    state = {
        editorState: EditorState.createEmpty(),
        title: ""
    }

    onEditorStateChange: Function = (editorState) => {
        this.setState({
          ...this.state,
          editorState
        })
      }

    handleTitleChange = (e) => {
      e.preventDefault()
      this.setState({
        ...this.state,
        title: e.target.value
      })
    }

    savePost = async () => {
      const data = await draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
      const title = this.state.title
      await axios.post("/blog/newPost", {data, title},{
        headers: {
            'Authorization': `bearer ${localStorage.getItem("token")}`
        }
      })
    }

  render(){
    const { editorState } = this.state
    return (
        <div className='container'>

            <label htmlFor="title">Title:</label>
            <input id="title" onChange={this.handleTitleChange}></input>

            <Editor
                editorState={editorState}
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
            <button onClick={this.savePost}>Save post</button>
        </div>
    )}
}

export default NewPost