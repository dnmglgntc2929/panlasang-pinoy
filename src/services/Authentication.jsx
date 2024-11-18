// import {useState, createContext, useContext} from "react";
// import React from 'react'
// import {useNavigate} from "react-router-dom";

// const navigate = useNavigate();
// const AuthContext = createContext(null);

// export const AuthProvider = ({children})=>{
//     const [user, setUser] = useState(null);

//     const login = (user) =>{
//         setUser(user);
//     }
//     const logout = () =>{
//         setUser(null);
       
//         localStorage.removeItem('jwt');
//     localStorage.removeItem('jwt');
//     navigate('/login');
//     }

//     useEffect(() => {
//         const checkTokenExpiration = () => {
//           const token = localStorage.getItem('jwt');
//           const tokenExpiration = localStorage.getItem('jwt');
//           if (token && tokenExpiration && Date.now() > tokenExpiration) {
//             logout();
//           }
//         };
    
//         const interval = setInterval(checkTokenExpiration, 1000);
//         return () => clearInterval(interval);
//       }, []);

//     return (
//         <AuthContext.Provider value={{ user, login, logout}}>
//             {children}
//         </AuthContext.Provider>
//     )   
// }

// export const useAuth = () =>{
//     return useContext(AuthContext)
// }

import {useState, createContext, useContext} from "react";
import React from 'react'
const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);

    const login = (user) =>{
        setUser(user);
    }
    const logout = () =>{
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>{
    return useContext(AuthContext)
}
