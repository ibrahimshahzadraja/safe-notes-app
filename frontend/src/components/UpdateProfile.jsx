import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { handleSuccess, handleError, backend_url } from '../../utils'
import { ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import Popup from "./Popup"
import * as cheerio from "cheerio"

const Signup = () => {

  let {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()


  const [user, setUser] = useState()
  const [initialUserData, setInitialUserData] = useState({
    username : '',
    about: '',
    avatar: ''
  })

  const [imageUrl, setImageUrl] = useState();
  const navigate = useNavigate();

  const fileInput = watch('avatar')

  useEffect(() => {
    if(fileInput?.[0]){
      setImageUrl(URL.createObjectURL(fileInput[0]))
    }
  }, [fileInput])

  const getUserData = async() => {
    let response;
    try {
        response = await axios.get(backend_url + "/users/get-user")
        setUser(response.data.data)
        setInitialUserData({...response.data.data})
    } catch (error) {
      handleError("Error while getting user data")
    }
  }

  function isObjectEmpty(obj) {
    return Object.values(obj).every(value => {
        if (Array.isArray(value)) {
            // Check if the array is empty
            return value.length === 0;
        } else if (value instanceof FileList) {
            // Check if the FileList is empty
            return value.length === 0;
        } else if (typeof value === 'object' && value !== null) {
            // Recursively check if the nested object is empty
            return isObjectEmpty(value);
        } else {
            // Check if the value is null, undefined, or an empty string
            return value === null || value === undefined || value === '';
        }
    });
}

  const onSubmit = async(data) => {
    if(isObjectEmpty(data)){
      //toast to tell user that nothing was changed
      handleError("Please make changes to save")
      return
    }
    const formData = new FormData(document.getElementById('update-profile-form'))
    let response;

    try{
      response = await axios.patch(backend_url + "/users/update-profile", formData, {headers: {'Content-Type' : 'multipart/form-data'}})
      if(response.status === 200){
        handleSuccess("Profile updated successfully")
        setTimeout(() => {navigate("/")}, 3000)
      }
    } catch(error){
      const $ = cheerio.load(error.response.data)
      const errorMessage = $('pre').contents().eq(0).text().replace("Error: ", "");
      handleError(errorMessage)
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  return (
    <>
    <div className='w-full min-h-[100vh] flex justify-center items-center'>
      <div style={{backgroundImage: "url('/login.png')", backgroundSize: "100% 100%", backgroundPosition: "center"}} className="image relative w-[100%] sm:w-[80%] h-[100%] sm:h-[95%] bg-darkGray rounded-md flex flex-col items-center justify-center">        
        <h1 className='text-3xl text-white font-bold my-3'>Update Profile</h1>
        <h5 className='text-slate-400'>Be more awesome!!</h5>
        <form onSubmit={handleSubmit(onSubmit)} className='my-3' id='update-profile-form'>
          <div className="form-field relative group">
            <label htmlFor="" className='text-slate-400'>Profile Picture</label>
            <div className='flex justify-center'>
              {!imageUrl && 
                <div className="profile-pic w-32 h-32 rounded-full bg-gradient-to-r overflow-hidden from-lightGray to-black">
                    <img src={initialUserData.avatar} alt="" />
                </div>
              }
              {imageUrl && 
                <div class="w-32 h-32 rounded-full overflow-hidden">
                  <img src={imageUrl} alt="Image" class="w-full h-full object-contain" />
                </div>
              }
            </div>
            <label htmlFor="file-drop" className='text-slate-100 absolute top-1/2 right-0 hidden group-hover:block'>
                <div>
                    <span className="material-symbols-outlined text-slate-400 cursor-pointer bg-[#332218] p-1 rounded-lg">edit</span>
                </div>
                <input type="file" id="file-drop" className='hidden' {...register("avatar")} />
            </label>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="username">Username</label>
            <input defaultValue={initialUserData.username} className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='Username' type="text" {...register("username")} />
            <span className="material-symbols-outlined absolute top-8 px-1">person</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="about">About</label>
            <input defaultValue={initialUserData.about} className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='Describe yourself' type="text" {...register("about")} />
            <span className="material-symbols-outlined absolute top-8 px-1">edit</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="password">Old Password</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='********' type="password" {...register("oldPassword")} />
            <span className="material-symbols-outlined absolute top-8 px-1 -rotate-45">key</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="confirmPassword">New Password</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='********' type="password" {...register("newPassword")} />
            <span className="material-symbols-outlined absolute top-8 px-1 -rotate-45">key</span>
          </div>
          <button disabled={isSubmitting} type='submit' className="w-full my-4 text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Update Info</button>
        </form>
        <span onClick={() => document.getElementById("update-popup").style.display = "block"} className="material-symbols-outlined text-white absolute top-1 right-1 cursor-pointer">close</span>
        <div className='hidden' id='update-popup'>
          <Popup message={"Leave without changes?"} redText={"No"} greenText={"Yes"} redFn={() => {document.getElementById("update-popup").style.display = "none"}} greenFn={() => navigate("/")} />
        </div>
      </div>
    <ToastContainer />
    </div>

    </>
  )
}

export default Signup
