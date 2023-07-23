import React,{useState} from 'react'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {http} from "./Axioshttp";
import {authContext} from "./AuthContext";


const axiosJWT = axios.create({
  baseURL:'http://localhost:5000/api',
})

export default function Dashboard() {
    const {user,setUser,authToken,setAuthToken,refreshTokenId,setRefreshTokenId} = React.useContext(authContext)
    const navigate=useNavigate();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
         
  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null)
    setAuthToken(null)
    setRefreshTokenId(null)
    navigate('/login')
}
const refreshToken = async () => {
  try{
    console.log("refresh token request",refreshTokenId)
    const res= await http.post('/refreshtoken',{token:sessionStorage.getItem('refreshToken')})
     //setUser(res?.data?.username)
     sessionStorage.setItem('token',res?.data?.accessToken)
      sessionStorage.setItem('refreshToken',res?.data?.refreshToken)
    setAuthToken(res?.data?.accessToken)
    setRefreshTokenId(res?.data?.refreshToken)
    return res?.data;
  }catch(err){
    console.log(err.message)
  }
  
}

axiosJWT.interceptors.request.use(
    async (config) => {
      //config.headers["Authorization"]="Bearer " + authToken
      const currentDate=new Date();
      //const decodedToken = jwt_decode(authToken);
      //console.log(decodedToken)
      // if(decodedToken.exp * 1000 < currentDate.getTime()){
      //   console.log('time expired condition')
      //   const data = await refreshToken();
      //   config.headers["Authorization"]="Bearer " + data?.accessToken
      // }
      return config
  }, (error) => {
    
    return Promise.reject(error)
  }
  
  )


  axiosJWT.interceptors.response.use((res) => {
      return res;
  }, async function (error){
        console.log("failed error",error)
        if(error && error.response.data.error === 'jwt expired'){
            const data = await refreshToken();
            console.log("generate refresh token",data)
            let oldRequest=error.config;
            oldRequest._retry=true; // purani req ko wapis s send kerna automatically
            oldRequest.headers["Authorization"]="Bearer " + sessionStorage.getItem('token')
            return axios(oldRequest)
        }
  })


const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      const res = await axiosJWT.delete("/user/" + id, {
        headers:{
          "Authorization":"Bearer " + authToken
        }
      });
      setSuccess(res?.data?.message);
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.message || err?.response?.data?.error)
    }
  };

  return (
    <div className="home">
          <span>
           
            Welcome to the <b>{user}</b> dashboard
            </span>
          <span>Delete Users:</span>
          <button className="deleteButton" onClick={() => handleDelete(1)}>
            Delete admin
          </button>
          <button className="deleteButton" onClick={() => handleDelete(2)}>
            Delete test user
          </button>
          <button className="deleteButton" onClick={() => handleLogout()}>
            Logout
          </button>
          {error && (
            <span className="error">
              {error}
            </span>
          )}
          {success && (
            <span className="success">
              {success}
            </span>
          )}
        </div>
  )
}
