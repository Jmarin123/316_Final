export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <div id="title-splash">
                <h4>Welcome To Playlister!</h4>
                <h6>🌻You can create create your own playlists and share them with others. Hope you enjoy🌻</h6>
            </div>
            <div id="items-on-splash">
                <form action="/home">
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