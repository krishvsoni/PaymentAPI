import { useContext, useState } from "react";
import { createContext } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { getItem, removeItem } = useLocalStorage('token');
    const [user, setUser] = useState(() => {
        return getItem() || null
    });
    const login = (user) => {
        setUser(user);
    }

    const logout = () => {
        removeItem();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}
