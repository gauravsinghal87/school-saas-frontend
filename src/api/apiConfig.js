import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,  
    headers: {
        "Content-Type": "application/json",
    },
});


// 🧠 REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// 🚨 RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => {
        return response.data; // directly return data
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    console.error("Unauthorized - Redirect to login");
                    localStorage.removeItem("token");
                    window.location.href = "/";
                    break;

                case 403:
                    console.error("Forbidden");
                    break;

                case 500:
                    console.error("Server error");
                    break;

                default:
                    console.error(error.response.data?.message || "Something went wrong");
            }
        } else {
            console.error("Network error");
        }

        return Promise.reject(error);
    }
);

export default api;