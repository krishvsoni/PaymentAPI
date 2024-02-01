import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../AuthProvider";
import { useEffect } from "react";
import TransferForm from "../components/TransferForm";

export default function Transfer() {
    const { id } = useParams();

    return (
        <div className="w-full flex justify-center items-center h-[100vh]">
            <TransferForm toUser={id} />
        </div>
    )
}
