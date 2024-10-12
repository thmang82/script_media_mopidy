

export namespace MopidyAPI {

    export interface RpcRequest {
        /* Normaly "2.0" */
        jsonrpc: string;
        /* ID */
        id: number;
        /* Method string */
        method: string;
        params?: object
    }

    export interface RpcResponse {
        /* Normaly "2.0" */
        jsonrpc: string;
        /* ID */
        id: number;
        /* Result string */
        result?: object;
        error?: {
            code: number,
            message: string, // e.g. 'Invalid params'
            data?: {
                type: string, // e.g. 'TypeError'
                message: string, // e.g. "get_items() missing 1 required positional argument: 'uri'",
                traceback?: string;
            }
        }
    }

    // https://docs.mopidy.com/en/latest/api/core/?highlight=start#playback-controller
    // "core.playback.play"  tlid: number
    // "core.playback.stop"
    // "core.playback.pause"
    // "core.playback.next"
    // "core.playback.previous"
    // "core.playback.seek" time_position: number; time position in milliseconds
    // "core.playback.get_current_tl_track" // Returns a mopidy.models.TlTrack or None.
    // "core.playback.get_current_tlid" // Returns a int or None.
    // "core.playback.get_stream_title" // Get the current stream title or None.
    // "core.playback.get_time_position"
    // "core.playback.get_state" // Get The playback state.

    // "core.library.browse"
    // "core.library.search"

    // "core.playlists.as_list" // Get a list of the currently available playlists.
    // "core.playlists.get_items" (uri)
    // "core.playlists.lookup"

    // "core.mixer.get_mute"
    // "core.mixer.set_mute"
    // "core.mixer.set_volume"
    // "core.mixer.get_volume"

    export type RpcMethod = 
        "core.tracklist.add" 
        | "core.tracklist.get_tl_tracks"
        | "core.tracklist.clear"
        | "core.playback.play"
        | "core.playback.stop"
        | "core.playback.pause"
        | "core.playback.play"
        | "core.playback.resume"
        | "core.playback.next"
        | "core.playback.previous"
        | "core.playback.get_state"
        | "core.playback.get_current_track"
        | "core.playback.get_time_position"
        | "core.playlists.get_items"
        | "core.library.get_images"
        | "core.mixer.get_mute"
        | "core.mixer.set_mute"
        | "core.mixer.get_volume"
        | "core.mixer.set_volume";

    export interface RpcReqGenericNoParams<M extends RpcMethod, R> {
        method: M;
        params?: undefined;
        r?: R;
    }
    export interface RpcReqGenericParams<M extends RpcMethod, P, R> {
        method: M;
        params: P;
        /* Do not set! This is only for type interference! */
        r?: R;
    }

    export type RpcRequests = ReqTracklistAdd 
        | ReqTracklistGetTracks
        | ReqTracklistClear
        | ReqPlaybackPlay
        | ReqPlaybackStop
        | ReqPlaybackResume
        | ReqPlaybackPause
        | ReqPlaybackPlayCurrent
        | ReqPlaybackNext
        | ReqPlaybackPrevious
        | ReqPlaybackGetState
        | ReqPlaybackGetCurrentTrack
        | ReqPlaybackGetTimnePosition
        | ReqPlaylistGetItems
        | ReqMixerGetMute 
        | ReqMixerGetVolume
        | ReqLibraryImages;
   
    export type ReqTracklistClear     = RpcReqGenericNoParams< "core.tracklist.clear", undefined>;
    export type ReqTracklistGetTracks = RpcReqGenericNoParams< "core.tracklist.get_tl_tracks", TlTrack[]>;
    export type ReqPlaybackStop       = RpcReqGenericNoParams< "core.playback.stop", undefined>;
    export type ReqPlaybackPause      = RpcReqGenericNoParams< "core.playback.pause", undefined>;
    export type ReqPlaybackPlayCurrent = RpcReqGenericNoParams< "core.playback.play", undefined>;
    export type ReqPlaybackResume     = RpcReqGenericNoParams< "core.playback.resume", undefined>;
    export type ReqPlaybackNext       = RpcReqGenericNoParams< "core.playback.next", undefined>;
    export type ReqPlaybackPrevious   = RpcReqGenericNoParams< "core.playback.previous", undefined>;
    export type ReqPlaybackGetState   = RpcReqGenericNoParams< "core.playback.get_state", PlaybackState>;
    export type ReqPlaybackGetCurrentTrack   = RpcReqGenericNoParams< "core.playback.get_current_track", Track | undefined | null>;
    export type ReqPlaybackGetTimnePosition  = RpcReqGenericNoParams< "core.playback.get_time_position", number | undefined | null>;

    export type ReqPlaybackPlay       = RpcReqGenericParams<"core.playback.play", {
        tlid: number
    } | {
        tracks: TlTrack
    }, undefined>
    export type ReqTracklistAdd   = RpcReqGenericParams<"core.tracklist.add", {
        tracks: Track[];
        /* If given, inserted at this position, otherwise inserted at the end! */
        at_position?: number
    } | {
        /* Unique IDs of tracks in database */
        uris: string[];
        /* If given, inserted at this position, otherwise inserted at the end! */
        at_position?: number
    }, TlTrack[]>;
    export type ReqLibraryImages   = RpcReqGenericParams<"core.library.get_images", { uris: string[] },  {
        [uri: string]: Image[]
    }>;
    export type ReqMixerGetMute    = RpcReqGenericNoParams<"core.mixer.get_mute", boolean>;
    export type ReqMixerGetVolume  = RpcReqGenericNoParams<"core.mixer.get_volume", boolean>;
    export type ReqPlaylistGetItems = RpcReqGenericParams<"core.playlists.get_items", {  
        /** Playlist uri */
        uri: string
    }, Ref[]>;

    export type Type = "album" | "artist" | "directory" | "playlist" | "track"
    export interface Ref {
        /* object URI */
        uri:  string;
        /* object type */
        type: Type;
        /* object name */
        name?: string;
    }

    export type Event = EventTitleChanged
        | EventPlaybackStateChanged
        | EventPlaybackPause
        | EventPlaybackEnded
        | EventPlaybackResumed
        | EventPlaybackStarted
        | EventTrackListChanged
        | EventVolumeChanged
        | EventSeeked
        | EventMuteChanged
        | EventOptionsChanged
        | EventPlaylistChanged
        | EventPlaylistDeleted
        | EventPlaylistsLoaded;

    export interface EventTitleChanged {
        event: "stream_title_changed";
        title: string;
    }
    export interface EventPlaybackStateChanged {
        event: "playback_state_changed";
        old_state: PlaybackState;
        new_state: PlaybackState;
    }
    export interface EventPlaybackPause {
        event: "track_playback_paused",
        tl_track: TlTrack;
        time_position: number;
    }
    export interface EventPlaybackEnded {
        event: "track_playback_ended",
        tl_track: TlTrack;
        time_position: number;
    }
    export interface EventPlaybackResumed {
        event: "track_playback_resumed",
        tl_track: TlTrack;
        time_position: number;
    }

    export interface EventPlaybackStarted {
        event: "track_playback_started";
        tl_track: TlTrack;
    }
    export interface EventTrackListChanged {
        event: "tracklist_changed";
    }
    export interface EventVolumeChanged {
        event: "volume_changed";
        /* the new volume in the range [0..100] */
        volume: number;
    }
    export interface EventSeeked {
        event: "seeked",
        time_position: number;
    }
    export interface EventMuteChanged {
        event: "mute_changed",
        mute: boolean;
    }
    export interface EventOptionsChanged {
        event: "options_changed";
    }
    export interface EventPlaylistChanged {
        event: "playlist_changed";
        playlist: Playlist;
    }
    export interface EventPlaylistDeleted {
        event: "playlist_deleted";
        uri: string;
    }
    export interface EventPlaylistsLoaded {
        event: "playlists_loaded";
        uri: string;
    }

    export type PlaybackState = "stopped" | "playing" | "paused";
    export interface TlTrack {
        /* tracklist ID */
        tlid: number;
        /* The track */
        track: Track
    }

    export interface RefTrack extends Track {
        __model__: 'Track';
    }
    export interface Track {
        /* Track URI */
        uri: string;
        /* Track Name */
        name: string;
        /* Track artists */
        artists?: Artist[];
        /* Track Album */
        album?: Album;
        /* Track composers */
        composers?: Artist[];
        /* Track performers */
        Performers?: Artist[];
        /* Genre */
        genre: string;
        /* Track number in album */
        track_no?: number;
        /* Disc number in album */
        disc_no?: number;
        /* Track release date (YYYY or YYYY-MM-DD) */
        date?: string; 
        /* Track length in milliseconds, not set if there is no duration (e.g. in case of radio streams) */
        length?: number;
        /* Bitrate in kbit/s */
        bitrate?: number;
        /* Track comment */
        comment?: string;
        /* MusicBrainz ID */
        musicbrainz_id?: string;
        /*  Represents last modification time */
        last_modified?: number;
    }

    export interface RefArtist extends Artist {
        __model__: 'Artist';
    }
    export interface Artist {
        /* Artist URI */
        uri: string;
        /* Artist name */
        name: string;
        /* Artist name for sorting */
        sortname?: string;
        /* MusicBrainz ID */
        musicbrainz_id?: string;
    }

    export interface RefAlbum extends Album {
        __model__: 'Album';
    }
    export interface Album {
         /* Album URI */
         uri: string;
         /* Album name */
         name: string;
        /* Album artists */
        artists?: Artist[];
        /* Number of tracks number in album */
        num_tracks?: number;
        /* Number of discs number in album */
        num_discs?: number;
        /* Album release date (YYYY or YYYY-MM-DD) */
        date?: string; 
        /* MusicBrainz ID */
        musicbrainz_id?: string;
    }

    export interface RefPlaylist extends Playlist {
        __model__: 'Playlist';
    }
    export interface Playlist {
         /* Playlist URI */
         uri: string;
         /* Playlist name */
         name: string;
         /* Playlist’s tracks */
         tracks: Track[];
         /* Playlist’s modification time in milliseconds since Unix epoch */
         last_modified: number;
    }

    export interface RefImage extends Image {
        __model__: 'Image';
    }
    export interface Image {
         /* URI of the image, might be an http url */
         uri: string;
         /* Optional width of image */
         width?: number;
         /* Optional height of image */
         height?: number;
    }

    export interface SearchResult {
        /* Search result URI */
        uri: string;
        /* Matching tracks */
        tracks?: Track[];
        /* Matching artists */
        artists?: Artist[];
        /* Matching albums */
        albums?: Album[];
    }
}