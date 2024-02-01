import { useNavigate } from "react-router-dom";
import axios from "axios";
// ui imports -- ignore :)
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button"
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from "./ui/card";
import useAuth from "../AuthProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const transferSchema = z.object({
    amount: z.string().min(0)
})

export default function TransferForm({ toUser }) {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(transferSchema)
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    const onSubmit = async (data) => {
        try {
            const transferRequest = async () => {
                await axios.post("http://localhost:3000/api/v1/account/transfer",
                    {
                        to: toUser,
                        amount: parseInt(data.amount)
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${user}`
                        }
                    }
                )
                navigate('/dashboard')
            }

            transferRequest();
        }
        catch (err) {
            if (err.response.status === 401) {
                setError("root", { message: err.response.data.message });
            }
            else {
                setError("root", { message: err.message });
            }
        }
    }

    return (
        <Card className={`w-[400px]`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader className="flex justify-center text-center">
                    <CardTitle className="font-bold text-3xl">Send Money</CardTitle>
                    <CardDescription>Enter Amount to Send</CardDescription>
                    {errors.root && (
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-red-500 text-sm">{errors.root.message}</p>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="grid gap-4">
                    <CardTitle className="font-bold text-2xl">Transfer money to your friend</CardTitle>
                    <div>
                        <Label className="mb-1 font-semibold" htmlFor="amount">Amount (in Rs)</Label>
                        <Input id="amount" type="number" {...register("amount")} placeholder="1000..." />
                    </div>
                    {errors.amount && (
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-red-500 text-sm">{errors.amount.message}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                    <Button className="w-full bg-green-500 font-semibold text-md" size="lg" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : "Initiate Transfer"}</Button>
                </CardFooter>
            </form>
        </Card>
    )
}


