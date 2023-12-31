import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { login, loginGoogle } from "/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import OneSignal from "react-onesignal";
import HubContext from "../../contexts/HubContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

async function loginOneSignal(uid) {
    await OneSignal.logout();
    await OneSignal.login(uid);
}
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();

    const { hub, setHub } = useContext(HubContext);
    // Kết nối với hub
    async function connectHub() {
        console.log("Bắt đầu chạy hub");
        const connection = new HubConnectionBuilder()
            .withUrl(`https://api.firar.live/chatHub`, {
                accessTokenFactory: () => {
                    return localStorage.getItem("token");
                },
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        try {
            await connection.start();
            console.log(
                "connectionqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
                connection
            );
            setHub(connection);
        } catch (e) {
            console.log("error", e);
        }
    }

    async function handleLogin() {
        try {
            setIsLoading(true);
            const response = await login(email, password);

            if (response.status === 400) {
                setError(response.title);
                setIsLoading(false);
                return;
            }
            console.log("response login: ", response);

            localStorage.setItem("userId", response.userId);
            localStorage.setItem("token", response.token);
            localStorage.setItem("tokenTimeOut", response.tokenTimeOut);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem(
                "refreshTokenTimeOut",
                response.refreshTokenTimeOut
            );
            localStorage.setItem("email", response.email);
            connectHub();
            loginOneSignal(response.userId);
            navigate("/Workspace");
        } catch (error) {
            console.error(error);
            setError("An error occurred while logging in.");
        }
    }

    // Google login
    useEffect(() => {
        const client_popup = window.google.accounts.oauth2.initCodeClient({
            client_id:
                "945996023510-0j32cbj68e6ftd38sampakldkhok571m.apps.googleusercontent.com",
            scope: "profile email",
            callback: async (response) => {
                const data = await loginGoogle(response.code);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("token", data.token);
                localStorage.setItem("tokenTimeOut", data.tokenTimeOut);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem(
                    "refreshTokenTimeout",
                    data.refreshTokenTimeout
                );
                connectHub();
                localStorage.setItem("email", data.email);
                loginOneSignal(data.userId);
                navigate("/Workspace");
            },
        });

        window.client_popup = client_popup;
    }, []);

    return (
        <>
            <div className="min-h-screen flex items-start">
                <div className="p-10 xs:p-0 mx-auto w-full max-w-md">
                    <h1 className="w-1/2 mx-auto mb-4">
                        <img src="assets\img\logo-no-background.png" alt="" />
                    </h1>

                    <div className="bg-white shadow w-full rounded-md divide-gray-200 border border-gray-300">
                        <div className="text-center pt-6 pb-1">
                            <h1 className="font-bold text-3xl text-gray-900">
                                Sign in
                            </h1>
                        </div>

                        <div className="px-5 py-1">
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">
                                Username
                            </label>
                            <div className="flex mb-2">
                                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                    <User className="text-gray-400 w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={25}
                                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-md border-[1.5px] border-gray-300 outline-none focus:border-indigo-500"
                                    placeholder="putinlord123"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">
                                Password
                            </label>
                            <div className="flex mb-2">
                                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                    <i className="mdi mdi-lock-outline text-gray-400 text-lg" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    maxLength={20}
                                    placeholder="***************"
                                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-md border-[1.5px] border-gray-300 outline-none focus:border-indigo-500"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleLogin();
                                    }}
                                />
                            </div>
                            <div className="text-right">
                                <Link
                                    to={"/get-otp-forget-password"}
                                    className="text-sm font-semibold mt-2 block"
                                >
                                    <span className="inline-block text-black hover:underline">
                                        Forgot Password?
                                    </span>
                                </Link>
                            </div>

                            <div className="text-red-500 font-medium text-sm h-6">
                                {error}
                            </div>

                            {isLoading ? (
                                <Button disabled className="w-full">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    onClick={() => handleLogin()}
                                >
                                    Login
                                </Button>
                            )}

                            <button
                                onClick={() =>
                                    window.client_popup.requestCode()
                                }
                                className="flex flex-wrap justify-center mt-4 w-full border border-gray-300 hover:border-gray-500 py-1.5 rounded-md"
                            >
                                <img
                                    className="w-5 mr-2"
                                    src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                                />
                                Sign in with Google
                            </button>

                            <div className="flex justify-center my-5">
                                <span className="text-sm text-gray-400 font-semibold">
                                    Don't have account?
                                </span>
                                <Link
                                    to={"/signup"}
                                    className="text-sm mx-1 font-semibold border-black hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
