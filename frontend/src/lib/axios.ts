import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api" ,
	withCredentials: true,
});

//import.meta.env.MODE === "development" ? : "/api"
