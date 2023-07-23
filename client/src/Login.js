import React,{useState} from 'react'
import {http} from "./Axioshttp";
import { useNavigate,useLocation } from 'react-router-dom';
import {authContext} from "./AuthContext";


export default function Login() {
    const {user,setUser,setAuthToken,setRefreshTokenId} = React.useContext(authContext)
    const navigate=useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

   let from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res= await http.post('/login',{username,password})
      sessionStorage.setItem('name',res.data.username)
      sessionStorage.setItem('token',res.data.accessToken)
      sessionStorage.setItem('refreshToken',res.data.refreshToken)
      setAuthToken(res.data.accessToken)
      setRefreshTokenId(res.data.refreshToken)
      setUser(res.data.username)

      
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="login">
    <form onSubmit={handleSubmit}>
      <span className="formTitle">Login</span>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="submitButton">
        Login
      </button>
    </form>
  </div>
  )
}
