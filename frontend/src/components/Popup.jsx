import React from 'react'

const Popup = ({message, redText, greenText, redFn, greenFn, onClick}) => {
  return (
    <div onClick={onClick} className='text-slate-200 w-[100vw] h-[100vh] bg-[#c4c4c44d] flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div onClick={(e) => e.stopPropagation()} id='popup' className="popup bg-[#252525] w-[220px] h-[140px] sm:w-[260px] sm:h-[180px] p-4 flex flex-col justify-between items-center rounded-lg">
        <span className="material-symbols-outlined">info</span>
        <p className=''>{message}</p>
        <div className="buttons flex w-[80%] sm:w-[70%] justify-between">
          <button className="bg-red-700 hover:bg-red-800 rounded-lg w-[70px] p-1.5" onClick={redFn}>{redText}</button>
          <button className="bg-green-700 hover:bg-green-800 rounded-lg w-[70px] p-1.5" onClick={greenFn}>{greenText}</button>
        </div>
      </div>
    </div>
  )
}

export default Popup
