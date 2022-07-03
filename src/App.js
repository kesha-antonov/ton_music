import './App.css';
import Dashboard from "./user-dashboard";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {authNapster, authSpotify} from "./user-dashboard/requests";
import AppContext from './app-context';
import {API_KEY} from "./consts";

const { Napster } = window;

function App() {
    const [contextValue, setContextValue] = useState({token: null})
    const [fetching, setFetching] = useState(false)

    useLayoutEffect(() => {
        Napster.init({ consumerKey: API_KEY, isHTML5Compatible: true });

        if (contextValue.token || fetching) return

        setFetching(true);
        authNapster().then((result) => {
            console.log(result);

            Napster.player.on('ready', () => {
                Napster.member.set({
                    accessToken: result.access_token,
                    refreshToken: result.refresh_token
                });
            });

            setContextValue({token: result.access_token})
            setFetching(false);
        })
            .catch(() => setFetching(false));
    }, [])

    return (
        <AppContext.Provider value={contextValue}>
            <Dashboard/>
        </AppContext.Provider>
    );
}

export default App;
