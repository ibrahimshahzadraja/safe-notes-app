import { Routes, Route, useNavigate } from "react-router-dom"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Home from "./components/Home"
import Editor from "./components/Editor"
import UpdateProfile from "./components/UpdateProfile"
import './App.css'
import { useEffect } from "react"
import axios from "axios"
import Preview from "./components/Preview"
import { backend_url } from "../utils"

function App() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()

  useEffect(() => {

    const getData = async() => {
  
      try {
        await axios.get(backend_url + "/users/get-user")
      } catch (error) {
        refreshToken()
      }

    }
    getData()
  }, [])



  const refreshToken = async () => {
    try {
      let res = await axios.post(backend_url + "/users/refresh-token")
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
    </Routes>
    </>
  )
}

export default App
