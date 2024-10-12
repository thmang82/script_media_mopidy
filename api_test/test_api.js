// Need to run "npm install ws"
const ws = require('ws');

let client = new ws("ws://server.lan:6680/mopidy/ws");

let resolve_map = {};

function sendMethod(method, params) {
    return new Promise((resolve) => {
        const uid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        let data_o = {
            jsonrpc: "2.0",
            id: uid,
            method
        }
        if (params) {
            data_o.params = params;
        }
        console.log("send: ", data_o);
        client.send(JSON.stringify(data_o));
        resolve_map[uid] = resolve;
    })
}

client.on('open', async () => {
    console.log("open");

    sendMethod("core.mixer.get_volume");
    sendMethod("core.playback.get_current_track"); // Current played track
    sendMethod("core.playback.get_time_position"); // Called every 10 seconds from mopidy/iris
    // sendMethod("core.playback.get_stream_title");
    // sendMethod("core.tracklist.get_tl_tracks"); // Current Tracks in Playlist
    sendMethod("core.tracklist.index"); // Without parameter: Index of current played track
    sendMethod("core.tracklist.get_random");
   
    // await sendMethod("core.playlists.as_list");
    // await sendMethod("core.playlists.get_items", { uri: "m3u:1Live.m3u8" });
    // sendMethod("core.playlists.get_items", { uri: "spotify:playlist:37i9dQZF1DX6ziVCJnEm59"});
    // sendMethod("core.playlists.lookup", { uri: "spotify:playlist:37i9dQZF1DX6ziVCJnEm59"});
    await sendMethod("core.library.get_images", { uris: [ "m3u:1Live.m3u8", "spotify:playlist:37i9dQZF1DX6ziVCJnEm59" ]});
    sendMethod("core.playback.get_state");
    
    /*
    sendMethod("core.library.browse", { uri: null });
    await sendMethod("core.tracklist.clear");
    let resp = await sendMethod("core.tracklist.add", { 
        // tracks: [], // tracks or uris, not both!
        uris: [
            "http://wdr-1live-live.icecast.wdr.de/wdr/1live/live/mp3/128/stream.mp3",
            "http://wdr-1live-live.icecast.wdr.de/wdr/1live/live/mp3/128/stream.mp3"
        ],
        at_position: 0
    });
    console.log("resp: ", resp);
    let tlid = resp[0].tlid;
    await sendMethod("core.playback.play", { tlid });
    */
    // sendMethod("core.playlists.get_items", { uri: "test" });
})

client.on('close', () => {
    console.log("Closed");
})
client.on('error', (err) => {
    console.log("Error", err);
})
client.on('message', (str) => {
    // console.log("Message: ", JSON.parse(str));
    let msg_o = JSON.parse(str);
    console.log("Message: ", JSON.stringify(msg_o, null, 4));
    const id = msg_o.id;
    if (resolve_map[id]) {
        resolve_map[id](msg_o.result);
    }
})

process.on('SIGINT', () => {
    client.close();
});