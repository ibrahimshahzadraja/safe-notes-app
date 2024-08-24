import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Home from "./components/Home"
import Editor from "./components/Editor"
import UpdateProfile from "./components/UpdateProfile"
import './App.css'
import { useEffect, useState } from "react"
import axios from "axios"
import Preview from "./components/Preview"
import Popup from "./components/Popup"

function App() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()

  const URL = "https://safe-notes-app.vercel.app/api/v1/users"

  useEffect(() => {

    const getData = async() => {
  
      try {
        await axios.get(URL + "/get-user")
      } catch (error) {
        refreshToken()
      }

    }
    getData()
  }, [])



  const refreshToken = async () => {
    try {
      let res = await axios.post(URL + "/refresh-token")
      window.location.reload(true)
    } catch (error) {
      navigate("/login")
    }
  }

  return (
    <>
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Home />} />
      <Route path='/editor/:noteId' element={<Editor />} />
      <Route path='/preview-note/:noteId' element={<Preview />} />
      <Route path='/update-profile' element={<UpdateProfile />} />
      <Route path='/u' element={<Popup />} />
    </Routes>
    </>
  )
}

export default App
