import React, { useEffect, useState } from 'react'
import Note from './Note'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { handleError } from '../../utils'
import { ToastContainer } from 'react-toastify'

const Home = () => {

    const URL = "https://safe-notes-app.vercel.app/api/v1/"

    const navigate = useNavigate();

    const [select, setSelect] = useState(false)
    const [user, setUser] = useState()
    const [notes, setNotes] = useState([])
    const [search, setSearch] = useState("")
    const [newest, setNewest] = useState(true)

    const handleSearch = () => {
        const searchIcon = document.getElementById("search-icon")
        const searchInput = document.getElementById("search-input")
        searchInput.value = ""

        if(searchIcon.style.display === 'none'){
            searchIcon.style.display = 'block'
            searchInput.style.display = 'none'
            
        }else{
            searchIcon.style.display = 'none'
            searchInput.style.display = 'block'
        }

    }

    const handleDropdown = () => {
        const dropdown = document.getElementById('filter-dropdown')
        if(dropdown.style.display !== "" && dropdown.style.display !== "none"){
            dropdown.style.display = "none"
        } else{
            dropdown.style.display = "block"
        }
    }

    const handleDeleteIcon = () => {
        setSelect(s => !s)
        const deleteIcon = document.getElementById("delete-icon")
        const filterIcon = document.getElementById("filter-icon")
        
        if(deleteIcon.style.display){
            deleteIcon.style.display = "none"
            filterIcon.style.display = "block"
        } else{
            deleteIcon.style.display = "block"
            filterIcon.style.display = "none"
        }
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        let response;

        const getUserData = async() => {
            try {
                response = await axios.get(URL + "users/get-user")
                setUser(response.data.data)
            } catch (error) {
                handleError("Error while getting user data")
            }
        }
        
        const getNoteData = async() => {
            try {
                response = await axios.get(URL + "notes/get-all-notes")
                setNotes(response.data.data)
            } catch (error) {
                handleError("Error while fetching notes")
            }
        }
        getUserData().then(
            r => getNoteData()
        )

    }, [])

    const previewNote = async (noteId) => {
        if(noteId){
            navigate(`/preview-note/${noteId}`)
        }
    }

    const editNote = async (noteId) => {
        if(noteId){
            navigate(`/editor/${noteId}`)
        }
    }

  return (
    <div className='text-slate-100 px-2 sm:px-8 py-3'>
      <div className="top-section my-3">
        <div className="flex justify-between w-full">
            <p className='text-3xl font-light'>Notes</p>
            <div className="search-bar">
                <span onClick={handleSearch} id='search-icon' className="material-symbols-outlined bg-[#332218] p-1 rounded-md cursor-pointer">search</span>
                <div className='relative hidden' id='search-input'>
                    <input value={search} onChange={handleSearchChange} type="text" placeholder='Search' className='rounded-lg bg-[#332218] px-4 py-1 outline-none' />
                    <span onClick={handleSearch} className="material-symbols-outlined absolute top-1 right-1 bg-[#332218] cursor-pointer">close</span>
                </div>
            </div>
        </div>
        <div className="user-profile group relative w-full sm:w-[50vw] max-w-[350px] flex gap-2 items-center bg-gradient-to-r from-darkGray via-darkGray to-amber-900 p-2 rounded-lg">
            <div className="image">
                <img className='rounded-full w-[60px] h-[60px] sm:w-[90px] sm:h-[90px] p-2' src={user?.avatar} alt="" />
            </div>
            <div className="profile-text sm:font-normal font-light text-sm sm:text-base">
                <h3 className='text-2xl'>{user?.username}</h3>
                <p>{user?.about}</p>
            </div>
            <span className="material-symbols-outlined hidden group-hover:block cursor-pointer absolute top-1 right-1"><Link to={"/update-profile"}>edit</Link></span>
        </div>
      </div>
      <div className="filter-section flex justify-between items-center w-full">
        <p className='text-xl font-light underline'>All({notes.length})</p>
        <div className="relative">
            <span id='filter-icon' className="material-symbols-outlined text-blue-600 cursor-pointer" onClick={handleDropdown}>filter_alt</span>
            <span id='delete-icon' className="material-symbols-outlined cursor-pointer hidden">delete</span>
            <div className='dropdown p-2 bg-[#332218] w-40 z-10 rounded-md absolute right-0 hidden' id='filter-dropdown'>
                <p>Sort by</p>
                <div>
                    <button className='bg-amber-900 px-2 py-1 my-1 w-full rounded-sm' onClick={() => {setNewest(true); handleDropdown()}}>Newest</button>
                </div>
                <div>
                    <button className='bg-amber-900 px-2 py-1 my-1 w-full rounded-sm' onClick={() => {setNewest(false); handleDropdown()}}>Oldest</button>
                </div>
            </div>
        </div>
      </div>
    <span className="material-symbols-outlined bg-[#252525] p-1.5 rounded-full fixed bottom-5 right-5 cursor-pointer"><Link to={"/editor/new"}>add</Link></span>
    {notes.length===0 && <div className="image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src="/first-note.png" alt="" />
    </div>}
    {notes.filter((note) => note.title.includes(search)).length === 0 && notes.length !== 0 && <div className="image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src="/not-found.png" alt="" />
    </div>}
    <div className='note-container grid grid-cols-2 md:grid-cols-4 my-5 gap-4'>
        {notes.filter((note) => note.title.includes(search)).sort((a, b) => {
        if (newest) {
            return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
        }
    }).map((note, i) => <div key={i} onClick={() => previewNote(note._id)}>
        <Note createdAt={note.createdAt.replace("T", " ").split(".")[0]} title={note.title} body={note.body.split(" ").slice(0, 2).join(" ") + "..."} /></div>)}
    </div>
    <ToastContainer />
    </div>
  )
}

export default Home
