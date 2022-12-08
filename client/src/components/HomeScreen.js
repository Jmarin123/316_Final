import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'


import WorkspaceScreen from './WorkspaceScreen'
import YouTubePlayer from './YoutubePlayer'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import { IoMdHome } from "react-icons/io";
import { BsPeopleFill, BsFillPersonFill } from "react-icons/bs";
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GiHamburgerMenu } from "react-icons/gi";
import AuthContext from '../auth'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    const [text, setText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [listingType, setListingType] = useState("home");
    const [sortState, setSortState] = useState("");
    const [youtubeOrComments, setComments] = useState("youtube");

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleHomeClick = (event) => {
        setListingType("home");
    }
    const handleListClick = (event) => {
        setListingType("allLists");
    }
    const handlePersonClick = (event) => {
        setListingType("personList")
    }


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleCreateNewList() {
        store.createNewList();
    }
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            console.log(listingType);
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    console.log("This is the user rn: " + auth.user);
    let iconsTopLeft;
    if (auth.guest) {
        //this is a guest!
        if (listingType == "home") {
            setListingType("allLists");
        }
        iconsTopLeft = <div>
            <IoMdHome className="topBarButton" id="disabledHome" />
            <BsPeopleFill className="topBarButton" onClick={handleListClick} />
            <BsFillPersonFill className="topBarButton" onClick={handlePersonClick} />
        </div>
    } else {
        iconsTopLeft = <div>
            <IoMdHome className="topBarButton" onClick={handleHomeClick} />
            <BsPeopleFill className="topBarButton" onClick={handleListClick} />
            <BsFillPersonFill className="topBarButton" onClick={handlePersonClick} />
        </div>
    }
    let listCard = "";
    let youtubePlaySongs = [];
    if (store.currentList) {
        for (let song of store.currentList.songs) {
            console.log(song);
            youtubePlaySongs.push(song.youTubeId);
        }
    }
    let youtubeOrCommentPage = ""
    if (youtubeOrComments == 'youtube') {
        youtubeOrCommentPage =
            <div>
                <YouTubePlayer playlist={youtubePlaySongs} />
            </div>
    } else {
        youtubeOrCommentPage =
            <div></div>
    }
    if (store) {
        if (sortState == "nameSort") {
            store.idNamePairs.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })
        } else if (sortState == "dateSort") {
            store.idNamePairs.sort((a, b) => {
                return a.publicDate - b.publishDate
            })

            //Todo: DO THE REST OF THE SORTS 
        }
        listCard =
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }} >
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="right-below-navbar">
                {
                    iconsTopLeft
                }
                <div id="searchBar">
                    <TextField
                        margin="normal"
                        fullWidth
                        id="Searching-Playlist"
                        placeholder="Search"
                        name="name"
                        autoComplete="Playlist Name"
                        className='searching-all-playlists'
                        onKeyPress={handleKeyPress}
                        onChange={handleUpdateText}
                        inputProps={{ style: { fontSize: 20 } }}
                        InputLabelProps={{ style: { fontSize: 20 } }}
                        autoFocus
                    />
                </div>
                <div id="filterBox">
                    <h2><strong>SORT BY</strong></h2>
                    <GiHamburgerMenu onClick={handleProfileMenuOpen} id="hamburgerSort" />
                </div>
            </div>
            <div id="seperating-list-and-youtube">
                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </div>
                <div id="youtube-player">
                    <div id="items-to-select-between-youtube-and-comments">
                        <div id="select-youtube" onClick={() => { setComments('youtube') }}>
                            Youtube
                        </div>
                        <div id="select-comments" onClick={() => { setComments('comments') }}>
                            Comments
                        </div>
                    </div>
                    {youtubeOrCommentPage}
                </div>
            </div>
            <div id="list-select">
                <Fab
                    color="primary"
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                >
                    <AddIcon />
                </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id='selecting-the-sort'
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => setSortState("nameSort")}>Name (A-Z)</MenuItem>
                <MenuItem onClick={() => setSortState("dateSort")}>Publish Date (Newest)</MenuItem>
                <MenuItem onClick={() => setSortState("listenSort")}>Listens(High - Low)</MenuItem>
                <MenuItem onClick={() => setSortState("likeSort")}>Likes (High - Low)</MenuItem>
                <MenuItem onClick={() => setSortState("dislikeSort")}>Dislikes (High - Low)</MenuItem>
            </Menu>
            <WorkspaceScreen />
        </div>)
}

export default HomeScreen;