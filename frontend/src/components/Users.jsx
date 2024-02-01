import { useState } from "react";
import { Input } from "./ui/input";
import useUsers from "../hooks/useUsers";
import useDebounce from "../hooks/useDebounce";
import { Button } from "./ui/button";
import UserIcon from "./ui/userIcon";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [query, setQuery] = useState('');
    const debouncedInput = useDebounce(query, 300);
    const users = useUsers(debouncedInput);
    const navigate = useNavigate();

    return (
        <>
            <div className="mx-6 my-4 grid grid-col gap-4">
                <h2 className="font-bold text-2xl">Users</h2>
                <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <div>
                    {users.map((user) => {
                        return <div key={user.username} className="flex justify-between items-center my-2">
                            <div className="flex justify-center items-center">
                                <UserIcon />
                                <h2 className="d-inline font-semibold text-xl">{`${user.firstName + " " + user.lastName}`}</h2>
                            </div>
                            <Button size="lg" onClick={() => {
                                navigate(`/transfer/${user._id}`);   
                            }} >Send Money</Button>
                        </div>

                    })}

                </div>
            </div>
        </>
    )
}
