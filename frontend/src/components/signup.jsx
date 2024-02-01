import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// ui imports -- ignore :)
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button"
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from "./ui/card";
import { z } from "zod";
import useAuth from "../AuthProvider";
import useLocalStorage from "../hooks/useLocalStorage";

const signupSchema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email(),
    password: z.string().min(6)
})

export default function SignUp() {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema)
    })
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setItem } = useLocalStorage('token');

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.email,
                password: data.password
            })
            login(response.data.token);
            setItem(response.data.token);
            navigate('/dashboard')
        }
        catch (err) {
            if (err.status === 401) {
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
                    <CardTitle className="font-bold text-3xl">Sign Up</CardTitle>
                    <CardDescription>Enter your information to create your account</CardDescription>
                    {errors.root && (
                        <div aria-live="polite" aria-atomic="true">
                            <p className="text-red-500 text-sm">{errors.root.message}</p>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        <Label className="mb-1" htmlFor="firstName">First Name</Label>
                        <Input id="firstName" type="text" placeholder="John" {...register("firstName")}
                            aria-describedby="firstName-error"
                        />
                        {errors.firstName && (
                            <div id="firstName-error" aria-live="polite" aria-atomic="true">
                                <p className="mt-1 text-red-500 text-sm">{errors.firstName.message}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <Label className="mb-1" htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" type="text" placeholder="Doe" {...register("lastName")}
                            aria-describedby="lastName-error"
                        />
                        {errors.lastName && (
                            <div id="lastName-error" aria-live="polite" aria-atomic="true">
                                <p className="mt-1 text-red-500 text-sm">{errors.lastName.message}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <Label className="mb-1" htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="johndoe@example.com" {...register("email")}
                            aria-describedby="email-error"
                        />
                        {errors.email && (
                            <div id="email-error" aria-live="polite" aria-atomic="true">
                                <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")}
                            aria-describedby="password-error"
                        />
                        {errors.password && (
                            <div id="password-error" aria-live="polite" aria-atomic="true">
                                <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                    <Button className="w-full" size="lg" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : "Sign Up"}</Button>
                    <div className="mt-2">
                        Already have an account? <Link to="/signin" className="text-semibold underline">Login</Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
