import React,{useState,useEffect} from 'react';
export const authContext = React.createContext();

export default function AuthProvider({children}) {
    const [authToken,setAuthToken]=useState(sessionStorage.getItem('token') || null);
    const [user, setUser] = useState(sessionStorage.getItem('name') || null);
    const [refreshTokenId, setRefreshTokenId] = useState(sessionStorage.getItem('refreshToken') || null);
   
    
const userCtx={
    user,
    setUser,
    authToken,
    setAuthToken,
    refreshTokenId,
    setRefreshTokenId
}
console.log("context api=",userCtx)
  return (
    <authContext.Provider value={userCtx}>
        {children}
    </authContext.Provider>
  )
}
