import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || `https://task-flow-backend-xp7s.onrender.com`;
console.log(API_BASE_URL)

const API = axios.create({
    baseURL: API_BASE_URL,
});

API.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


API.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalReq = err.config;
        if (err.response.status === 401 && !originalReq._retry) {
            originalReq._retry = true;
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });

            await AsyncStorage.setItem('accessToken', data.accessToken);
            originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
            return API(originalReq);
        }
        return Promise.reject(err);
    }
);


interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}


export interface OtpPayload {
    email: string;
    otp: string;
}

export interface loginPayload {
    email: string;
    password: string
}


export const registerUser = async (payload: RegisterPayload) => {
    try {
        console.log("Sending payload: HOI HOI", payload, API);
        const response = await API.post('/auth/register', payload);
        console.log("Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Axios error:", error.message || error);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
};



export const verifyOTP = async (payload: OtpPayload): Promise<any> => {
    try {
        console.log("Sending payload :", payload);
        const response: AxiosResponse = await API.post('/auth/verify', payload);
        console.log("Response received :", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Axios Error:", error.message);
        if (error.response) {
            console.error("💥 Response data:", error.response.data);
        }
        throw error;
    }
};


export const login = async (payload: loginPayload) => {
    try {
        const response: AxiosResponse = await API.post('/auth/login', payload);
        return response.data
    } catch (error: any) {

        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}



export const addTask = async(payload : any) => {
    try {
        const response: AxiosResponse = await API.post('/task', payload);
        return response.data
    } catch (error: any) {

        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}


export const getTasks = async () => {
  try {
    const response: AxiosResponse = await API.get('/task');
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteTask = async (id: string) => {
  try {
    const response: AxiosResponse = await API.delete(`/task/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};

export const toggleTaskStatus = async (id: string) => {
  try {
    const response: AxiosResponse = await API.patch(`/task/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error toggling status:", error.response?.data || error.message);
    throw error;
  }
};