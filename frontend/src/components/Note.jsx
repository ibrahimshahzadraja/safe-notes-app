import React from 'react'
const Note = ({title, body, createdAt}) => {


  return (
    <div id='note-preview' style={{background: 'linear-gradient(to bottom, #332218, #121212)'}} className='text-white group h-[200px] shadow-sh cursor-pointer relative flex flex-col justify-center items-center gap-3 p-5 rounded-xl'>
      <h1 className='text-xl font-bold text-center my-2'>{title}</h1>
      <p className='text-lg'>{body}</p>
      <p className='absolute bottom-0 right-0 hidden group-hover:block text-slate-500'>{createdAt}</p>
    </div>
  )
}

export default Note
