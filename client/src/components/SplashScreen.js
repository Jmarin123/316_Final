import AuthContext from '../auth'
import React, { useContext } from "react";
export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    function handleGuestSubmit(event) {
        event.preventDefault();
        auth.loginGuest();
    }
    return (
        <div id="splash-screen">
            <div id="title-splash">
                <h4>Welcome To Playlister!</h4>
                <h6>🌻You can create create your own playlists and share them with others. Hope you enjoy🌻</h6>
            </div>
            <div id="items-on-splash">
                <form action="/" onSubmit={handleGuestSubmit}>
                    <input type="submit" value="🌼Guest🌼" />
                </form>
                <form action="/register">
                    <input type="submit" value="🌷Register🌷" />
                </form>
                <form action="/login">
                    <input type="submit" value="🌹Login🌹" />
                </form>
            </div>
        </div>
    )
}