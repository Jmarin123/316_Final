import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { BsFillArrowDownSquareFill, BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from "react-icons/bs";
import List from '@mui/material/List';
import SongCard from './SongCard';
import AuthContext from '../auth'
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);
            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    const handleAddingSong = () => {
        store.addNewSong();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }
    async function handlePublishList(event) {
        await store.publishList(idNamePair._id);
    }
    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }
    async function handleLikes(event) {
        store.likeOrDislike(idNamePair._id, idNamePair.likes + 1, idNamePair.dislikes)
    }
    async function handleDislikes(event) {
        store.likeOrDislike(idNamePair._id, idNamePair.likes, idNamePair.dislikes + 1);
    }
    async function handleDoubleClickEdit(event) {
        if (auth.guest) return;
        const playListToGet = await store.getPlaylist(event.target.id);
        if (playListToGet.ownerEmail === auth.user.email && playListToGet.publishDate === -1) {
            toggleEdit();
        }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardOnList;
    if (idNamePair.publishDate !== -1) {
        //This means it has been published! and needs to have the cards to be displaying raiting system
        cardOnList =
            <div className="topRowForList">
                <div className='cardOnList'>
                    <h3>{idNamePair.name}</h3>
                    <h6>By: {idNamePair.ownerName}</h6>
                </div>
                <div className="likes-and-dislikes">
                    <div className='allLikes' onClick={handleLikes}>
                        <BsFillHandThumbsUpFill />
                        {idNamePair.likes}
                    </div>
                    <div className='allDislikes'>
                        <BsFillHandThumbsDownFill onClick={handleDislikes} />
                        {idNamePair.dislikes}
                    </div>
                </div>
            </div>
    } else {
        cardOnList =
            <div className='cardOnList'>
                <h3>{idNamePair.name}</h3>
                <h6>By: {idNamePair.ownerName}</h6>
            </div>
    }

    let permissionsOnList = "";

    if (!auth.guest) {
        if (store.currentList && store.currentList.publishDate === -1) {
            //In the case where it's the owner that hasnt published
            permissionsOnList =
                <div id="customized-row-for-list">
                    <div id="undo-redo">
                        <button
                            className='Button-In-List-Editor'
                            disabled={!store.canUndo()}
                            onClick={() => { store.undo() }}
                        >Undo</button>
                        <button
                            className='Button-In-List-Editor'
                            disabled={!store.canRedo()}
                            onClick={() => { store.redo() }}
                        >Redo</button>
                    </div>
                    <div>
                        <button className='Button-In-List-Editor'
                            onClick={handlePublishList}
                        >Publish</button>
                        <button
                            className='Button-In-List-Editor'
                            onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }}
                        >
                            Delete</button>
                        <button className='Button-In-List-Editor'>Duplicate</button>
                    </div>
                </div>
        } else if (store.currentList && store.currentList.publishDate !== -1 && auth.user.email === store.currentList.ownerEmail) {
            //In the case where it's the owner but has publishes
            permissionsOnList =
                <div id="customized-row-for-list">
                    <button className='Button-In-List-Editor'>Delete</button>
                    <button className='Button-In-List-Editor'>Duplicate</button>
                </div>
        } else if (store.currentList && store.currentList.publishDate !== -1 && auth.user.email !== store.currentList.ownerEmail) {
            permissionsOnList = <div id="customized-row-for-list">
                <button>Duplicate</button>
            </div>
        }
    }
    let openedList = "";
    if (store.currentList && store.currentList._id === idNamePair._id) {
        openedList =
            <div id="realUserEditingPlaylist">
                <List sx={{ width: '80%', left: '5%', bgcolor: 'background.paper' }} id="openedListCurrent" >
                    {store.currentList.songs.map((song, index) => (
                        <SongCard
                            song={song}
                            index={index}
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)} />
                    ))}
                    <ListItem
                        button
                        id="addSongCardCustom"
                        onClick={handleAddingSong}
                    >+</ListItem>
                </List>
                {permissionsOnList}
            </div>
    }
    let cardElement =
        <ListItem
            className="allListCards"
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '20pt' }}
            onDoubleClick={handleDoubleClickEdit}
        // button
        // onClick={(event) => {
        //     handleLoadList(event, idNamePair._id)
        // }}
        >

            {cardOnList}
            {openedList}
            <div class="drop-down-card-list">
                <BsFillArrowDownSquareFill button onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
                />
            </div>
            {/* <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{ fontSize: '48pt' }} />
                </IconButton>
            </Box> */}

        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;