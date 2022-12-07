import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import { IoMdHome } from "react-icons/io";
import { BsPeopleFill, BsFillPersonFill } from "react-icons/bs";
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

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

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleHomeClick = (event) => {
        console.log("HEY!");
    }
    const handleListClick = (event) => {
        console.log("OOF");
    }
    const handlePersonClick = (event) => {
        console.log("EAA");
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleCreateNewList() {
        store.createNewList();
    }
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            console.log(text);
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    console.log("This is the user rn: " + auth.user);
    let listCard = "";
    if (store) {
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
                <div>
                    <IoMdHome className="topBarButton" onClick={handleHomeClick} />
                    <BsPeopleFill className="topBarButton" onClick={handleListClick} />
                    <BsFillPersonFill className="topBarButton" onClick={handlePersonClick} />
                </div>
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
                        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                    </Menu>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={'testtinngg'}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                    </IconButton>
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
        </div>)
}

export default HomeScreen;