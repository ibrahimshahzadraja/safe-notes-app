import {toast} from "react-toastify";

export const handleSuccess = (msg) => {
    toast.success(msg, {position: 'top-right'})
}

export const handleError = (msg) => {
    toast.error(msg, {position: 'top-right'})
}

// export const backend_url = "https://safe-notes-app.vercel.app/api/v1";
export const backend_url = "http://localhost:8000/api/v1";