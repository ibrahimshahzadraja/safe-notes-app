import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { handleSuccess, handleError } from '../../utils'
import { ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'
import axios from "axios"
import * as cheerio from "cheerio"

const Signup = () => {

  let {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const [imageUrl, setImageUrl] = useState();

  const fileInput = watch('avatar')

  useEffect(() => {
    if(fileInput?.[0]){
      setImageUrl(URL.createObjectURL(fileInput[0]))
    }
  }, [fileInput])

  const onSubmit = async() => {
    const URL = "https://safe-notes-app.vercel.app/api/v1/users/register"

    const formData = new FormData(document.getElementById('signup-form'))
    let response;

    try{
      response = await axios.post(URL, formData, {headers: {'Content-Type' : 'multipart/form-data'}})
    } catch(error){
      const $ = cheerio.load(error.response.data);
      const preTag = $('pre')
      const errorMessage = preTag.html().split('<br>')[0].replace("Error: ", "");

      handleError(errorMessage)
    }

    if(response?.data.statusCode === 200){
      handleSuccess(response.data.message)
    }
  }


  return (
    <>
    <div className='w-full min-h-[100vh] flex justify-center items-center'>
      <div style={{backgroundImage: "url('/login.png')", backgroundSize: "100% 100%", backgroundPosition: "center"}} className="image w-[100%] sm:w-[80%] h-[100%] sm:h-[95%] bg-darkGray rounded-md flex flex-col items-center justify-center">        
        <h1 className='text-3xl text-white font-bold my-3'>Get Started Free</h1>
        <h5 className='text-slate-400'>Writing is clarifying!!</h5>
        <form onSubmit={handleSubmit(onSubmit)} className='my-3' id='signup-form'>
          <div className='form-field text-slate-400 flex flex-col'>
            <label className='text-slate-400' htmlFor="avatar">Profile Picture</label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center overflow-hidden justify-center w-32 h-32 border-2 rounded-full cursor-pointer bg-gradient-to-r from-lightGray to-black">
                    <div className='w-full h-full' style={{backgroundImage : `url(${imageUrl})`, backgroundSize: 'cover'}}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 my-3">
                        {!imageUrl &&
                        <div className='flex flex-col items-center justify-center'>
                          <div className='text-slate-400'>Upload an</div>                     
                          <div className='text-slate-400'>image</div>
                        </div>
                        }
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" {...register("avatar")} />
                    </div>
                </label>
            </div> 
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="username">Username</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='Username' type="text" {...register("username")} />
            <span className="material-symbols-outlined absolute top-8 px-1">person</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="about">About</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='Describe yourself' type="text" {...register("about")} />
            <span className="material-symbols-outlined absolute top-8 px-1">edit</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="password">Password</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='********' type="password" {...register("password")} />
            <span className="material-symbols-outlined absolute top-8 px-1 -rotate-45">key</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="confirmPassword">Confirm Password</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='********' type="password" {...register("confirmPassword")} />
            <span className="material-symbols-outlined absolute top-8 px-1 -rotate-45">key</span>
          </div>
          <div className='text-slate-400 my-3 flex justify-center gap-1 w-full'>
            Already have an account? <span className='text-slate-200 font-semibold cursor-pointer'><Link to={"/login"}>Sign in</Link></span>
          </div>
          <button disabled={isSubmitting} type='submit' className="w-full text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign Up</button>
        </form>
      </div>
    <ToastContainer />
    </div>

    </>
  )
}

export default Signup
