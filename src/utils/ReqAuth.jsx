import  { useAuth } from "../services/Authentication";
import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth ({children}){
    const auth = useAuth();
    if (!auth.user){
        return <Navigate to='/login'/>
    }
    return children;
}