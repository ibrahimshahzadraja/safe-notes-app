import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { handleSuccess, handleError } from '../../utils'
import { ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'
import axios from 'axios'
import * as cheerio from "cheerio"
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()

  let {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async(data) => {
    const URL = "https://notes-app-backend-kappa.vercel.app/api/v1/users/login"

    let response;

    try{
      response = await axios.post(URL, {...data})
      if(response.status === 200){
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
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
      <div style={{backgroundImage: "url('/login.png')", backgroundSize: "100% 100%", backgroundPosition: "center"}} className="image w-[100%] bg-darkGray sm:w-[80%] min-h-[100vh] sm:min-h-[95vh] rounded-md flex flex-col items-center justify-center gap-16">
        <div className='flex flex-col items-center justify-center space-y-3'>
            <h1 className='text-3xl text-white font-bold'>Welcome Back!</h1>
            <h5 className='text-slate-400'>Documenting is organizing!!</h5>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='my-3'>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="username">Username</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='Username' type="text" {...register("username")} />
            <span className="material-symbols-outlined absolute top-8 px-1">person</span>
          </div>
          <div className='form-field text-slate-400 flex flex-col relative'>
            <label className='text-slate-400' htmlFor="password">Password</label>
            <input className='px-8 py-2 rounded-lg outline-none bg-gradient-to-r from-lightGray to-black' placeholder='********' type="password" {...register("password")} />
            <span className="material-symbols-outlined absolute top-8 px-1 -rotate-45">key</span>
          </div>
          <div className='text-slate-400 my-3 flex justify-center gap-1 w-full'>
            Don't have an account? <span className='text-slate-200 font-semibold cursor-pointer'><Link to={"/signup"}>Sign up</Link></span>
          </div>
          <button disabled={isSubmitting} type='submit' className="w-full text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Login</button>
        </form>
      </div>
    <ToastContainer />
    </div>

    </>
  )
}

export default Login
