import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : `http://${window.location.hostname}:5001/api`, // Dynamically use the current hostname or environment variable
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
