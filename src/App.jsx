import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routers";
import { useEffect, useRef, useState } from "react";
import OneSignal from "react-onesignal";
import config from "/appconfig.js";
import { Toaster } from "@/components/ui/toaster";
import useHubStore from "@/storages/useHubStore";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";


const App = function () {
    const { hub, setHub } = useHubStore();

    // Kết nối với hub
    useEffect(() => {
        // check access token is valid or not expired
        if (!localStorage.getItem("token")) {
            setHub(null);
            return;
        }
        async function connect() {
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
                console.log("connect success");
                console.log("connectionqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", connection);
                setHub(connection);
            } catch (e) {
                console.log("error", e);
            }
        }
        connect();
    }, []);

    useEffect(() => {
        try {
            initialize();
        } catch (e) {
            console.log("error", e);
        }
    }, []);
    // const [hub, setHub] = useHubContext();
    return (
        <>
            {/* //<HubContext.Provider value={[hub, setHub]}> */}
            <RouterProvider router={router} />
            <Toaster />
            {/* //</HubContext.Provider> */}
        </>
    );
};
const node = document.querySelector("#root");
const root = createRoot(node);
root.render(<App />);

const initialize = async () => {
    await OneSignal.init({
        appId: config.oneSignalKey,
        autoResubscribe: true,
    });
};
