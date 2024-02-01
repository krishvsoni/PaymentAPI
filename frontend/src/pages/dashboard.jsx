import { useNavigate } from "react-router-dom";
import useAuth from "../AuthProvider"
import { useEffect } from "react";
import AppBar from "../components/AppBar";
import Balance from "../components/Balance";
import Users from "../components/Users";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/signin')
        }
    }, [user, navigate])


    return (
        <>
            <AppBar />
            <Balance />
            <Users />
        </>
    )
}

