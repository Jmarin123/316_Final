const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: {
            type: [{
                title: String,
                artist: String,
                youTubeId: String,
                likes: Number,
                dislikes: Number
            }], required: true
        },
        likes: Number,
        dislikes: Number,
        publishDate: { type: Number, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Playlist', playlistSchema)
