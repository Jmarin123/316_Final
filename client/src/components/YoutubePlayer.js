import React from 'react';
import YouTube from 'react-youtube';
import { AiFillPlayCircle } from "react-icons/ai";
import { BsPauseCircleFill } from "react-icons/bs";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
export default function YouTubePlayer(props) {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    const { playlist } = props;
    function handleStart(event) {
        playerOutside.playVideo();
    }

    function handlePause(event) {
        playerOutside.pauseVideo();
    }
    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;
    let outsideVar;
    let playerOutside;
    const playerOptions = {
        height: '390',
        width: '540',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        playerOutside = player;
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
    }
    function decSong() {
        currentSong--;
        currentSong = currentSong % playlist.length;
    }

    function forwardSong() {
        incSong();
        loadAndPlayCurrentSong(outsideVar);
    }

    function handleReverseSong() {
        decSong();
        loadAndPlayCurrentSong(outsideVar);
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        outsideVar = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    return (
        <div>
            <YouTube
                videoId={playlist[currentSong]}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange} />
            <RxDoubleArrowLeft
                className="youtubeIcons"
                onClick={handleReverseSong}
            />
            <BsPauseCircleFill
                onClick={handlePause}
                className="youtubeIcons"
            />
            <AiFillPlayCircle
                onClick={handleStart}
                className="youtubeIcons"
            />
            <RxDoubleArrowRight
                onClick={forwardSong}
                className="youtubeIcons"
            />
        </div>);
}