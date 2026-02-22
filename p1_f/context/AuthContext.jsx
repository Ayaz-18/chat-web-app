import{ createContext } from "react";
import axios from "axios";




const AuthContext = React.createContext();
axios.defaults.baseURL = import.meta.env.BACKEND_URL;
export const AuthProvider = ({ children }) => {
  const value={
     axios
  }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}  

