import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// APIS Request 


// Auth Functions
export const authenticate = async (username) =>{
    try { 
        return await axios.post('/api/authenticate', {username})
    } catch (error) {
        return {error: "Username doesn't exist "}
    }
}


// Get User Details
export const getUser = async ({username}) =>{
    try { 
       const {data} =  await axios.get(`/api/user/${username}`)
        return {data};
    } catch (error) {
        return {error: "Password doesn't match "}
    }
}

// Register
export const register = async (credentials) =>{
    try {
       const {data : { msg }, status} = await axios.post(`/api/register`, credentials)
        
       let {username, email} = credentials

       // send email
        if(status === 201){
            await axios.post('/api/register-mail', {username, userEmail: email, text:msg})
        }
        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({error})
    }
}

// login 
export const verifyPassword = async ({username, password}) =>{
    try {
        if(username){
            const {data} =   await axios.post(`/api/login`, {username, password})
            return Promise.resolve({data})
        }
    } catch (error) {
        return Promise.reject({error:"Password doesn't match "})
    }
}

// update user function
export const updateUser = async (response) =>{
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/update-user', response, {header: {"Authorization": `Bearer ${token}`}})
    
        return Promise.resolve({data})
    } catch (error) {
        return Promise.reject({error: "Couldn't Update Profile...!"})
    }
}


// generate OTP
export const generateOTP = async (username) =>{
    try {
        const { data : {code}, status} = await axios.get('/api/generate-otp', {params: {username}})
        
        // send mail with otp
        if(status === 201){
            let {data: {email}} = await getUser({username})
            let text = `Your password recovery OTP is ${code}, Verify and recover your password.`
            await axios.post('/api/register-mail', {username, userEmail: email, text, subject:"Password recovery otp"})
        }
        return Promise.resolve(code);
  
    } catch (error) {
        return Promise.reject({error});
    }
}

// Verify otp
export const verifyOTP = async ({username, code}) =>{
    try {
       const {data, status} = await axios.get('/api/verify-otp', {params : {username, code}})
       return {data, status}
    } catch (error) {
        return Promise.reject(error);
    }
}

// reset password
export const resetPassword = async ({username, password}) =>{
    try {
        const {data, status} = await axios.put('/api/reset-password', {username, password})
        return Promise.resolve({data, status})
    } catch (error) {
        return Promise.reject({error});
    }
}