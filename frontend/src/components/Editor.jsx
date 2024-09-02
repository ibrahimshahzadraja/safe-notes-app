import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Popup from './Popup'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess, backend_url } from '../../utils'

const Editor = () => {

    const [note, setNote] = useState();
    const [initialNote, setInitialNote] = useState({});
    const [isSaved, setIsSaved] = useState(false);

    const {noteId} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
      document.title = "Safe Notes - Editor"
    }, [])

    const saveNote = async() => {
        const title = document.getElementById('title-input').value
        const body = document.getElementById('body-input').value
        const data = {title, body}

        if(title === "" || body === ""){
          handleError("Note can't be empty")
          return
        }

        try {
          let response;
          if(!isSaved){
            setIsSaved(true);
            if(noteId === "new"){
              response = await axios.post(backend_url + "/notes/create-note", data)
            }else{
              response = await axios.patch(backend_url + `/notes/update-note/${noteId}`, data)
            }
            handleSuccess("Note saved successfully")
            setTimeout(() => {
              if(response.status === 200){
                navigate("/")
              }
            }, 4000)
          }
        } catch (error) {
            handleError("Error while saving the note")
            setTimeout(() => {
              navigate("/")
        }, 4000)
        }
    }

    const getNoteContent = async () => {
      try {
          let response = await axios.get(backend_url + `/notes/get-note/${noteId}`)
          setNote(response.data.data)
          document.getElementById('title-input').value = response.data.data.title
          document.getElementById('body-input').value = response.data.data.body
          setInitialNote({title: response.data.data.title, body: response.data.data.body})
      } catch (error) {
          
      }
  }

  const handlePopup = () => {
    const currentNote = {title: document.getElementById("title-input").value, body: document.getElementById("body-input").value}
    if(currentNote.title === "" && currentNote.body === ""){
      navigate("/")
    } else{
      if(currentNote.title === initialNote.title && currentNote.body === initialNote.body){
        navigate("/")
      } else{
        document.getElementById('save-popup').style.display = "block"
      }
    }
  }

    useEffect(() => {
      if(noteId !== "new"){
        getNoteContent()
      }
    }, [])

  return (
    <div className='text-white p-8 h-[100vh] '>
      <div className="icons w-full flex justify-between items-center">
        <span onClick={handlePopup} className="material-symbols-outlined text-3xl bg-[#332218] p-1.5 rounded-lg cursor-pointer">keyboard_arrow_left</span>
        <span onClick={saveNote} className="material-symbols-outlined text-3xl bg-[#332218] p-1.5 rounded-lg cursor-pointer">save</span>
      </div>
      <div className="inputs h-3/4">
        <input id='title-input' type="text" placeholder='Title' className='w-full text-3xl py-6 bg-transparent outline-none' />
        <textarea id='body-input' className='w-full min-h-full bg-transparent outline-none resize-none' placeholder='Type Something...'></textarea>
      </div>
      <div className='hidden' id='save-popup'>
        <Popup onClick={() => {document.getElementById("save-popup").style.display = "none"}} message={"Save Changes?"} redText={"Discard"} greenText={"Save"} redFn={() => navigate("/")} greenFn={saveNote} />
      </div>
      <ToastContainer />
    </div>
  )
}

export default Editor
