import useAuth from "../AuthProvider";
import { Button } from "./ui/button";
import UserIcon from "./ui/userIcon";

export default function AppBar() {
    const { logout } = useAuth();
    return (
        <>
            <nav className="flex justify-between items-center p-4 py-2 border-b-2 border-slate-200">
                <h1 className="text-3xl font-bold">Payments App</h1>
                <div className="flex justify-center items-center">
                    <h2 className="text-xl font-semibold">Hello, User</h2>
                    <UserIcon />
                    <Button onClick={() => logout()}>LogOut</Button>
                </div>
            </nav>
        </>
    )
}
