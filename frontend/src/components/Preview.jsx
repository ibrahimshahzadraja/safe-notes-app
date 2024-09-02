import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Popup from './Popup'
import { handleError, handleSuccess, backend_url } from '../../utils'
import { ToastContainer } from 'react-toastify'

const Preview = () => {

    const {noteId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      document.title = "Safe Notes - Note Preview"
    }, [])

    const [note, setNote] = useState();

    const getNoteContent = async () => {
        try {
            let response = await axios.get(backend_url + `/notes/get-note/${noteId}`)
            setNote(response.data.data)
            console.log(response.data.data)
        } catch (error) {
            handleError("Error while fetching the note")
        }
    }

    const deleteNote = async () => {
      try {
        let response = await axios.delete(backend_url + `/notes/delete-note/${noteId}`)
        handleSuccess("Note deleted successfully!")
        setTimeout(() => {
          if(response.status === 200){
            navigate("/")
          }
        }, 4000)
      } catch (error) {
        handleError("Error while deleting the note")
      }
    }

    useEffect(() => {
        getNoteContent()
    }, [])

  return (
    <div className='text-white p-8 h-[100vh] bg-mediumGray '>
      <div className="icons w-full flex justify-between items-center">
        <span className="material-symbols-outlined text-3xl bg-[#664430] p-1.5 rounded-lg cursor-pointer"><Link to={"/"}>keyboard_arrow_left</Link></span>
        <div className='flex gap-2'>
            <span onClick={() => navigate(`/editor/${noteId}`)} className="material-symbols-outlined text-3xl bg-[#664430] p-1.5 rounded-lg cursor-pointer">edit</span>
            <span onClick={() => document.getElementById("delete-popup").style.display = "block"} className="material-symbols-outlined text-3xl bg-[#664430] p-1.5 rounded-lg cursor-pointer">delete</span>
        </div>
      </div>
      <div className="inputs h-3/4">
        <p id='title-input' className='w-full text-3xl py-6 bg-transparent outline-none'>{note?.title}</p>
        <p id='body-input' className='w-full max-h-full bg-transparent outline-none resize-none'>{note?.body}</p>
      </div>
      <div className='hidden' id='delete-popup'>
        <Popup onClick={() => document.getElementById('delete-popup').style.display = "none"} message={"Delete this note?"} redText={"No"} greenText={"Yes"} greenFn={deleteNote} redFn={() => window.location.href = "/"} />
      </div>
      <ToastContainer />
    </div>
  )
}

export default Preview
