// Initiation Variables
var gmy_init = false;       // True if GMY is setup
var player_init = false;    // True if there is a YT Object

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Setup
function setup() { 
    if (!gmy_init) {
        // Define Variables
        var player;                                             // YouTube Player ID (Not Video ID!)                       
        var wrapper = document.createElement("div");            // Wrapper HTML Element        
        var canvas = document.getElementById("canvas");         // The HTML5 Canvas ID        
        var player_html = document.createElement("div");                 // The Player HTML element                
        var player_id = 0;                                      // Multiple Player Support, Future?

        // Setup Player HTML
        player_html.setAttribute("id",  "player");
        player_html.style.position = "absolute";
        player_html.style.left = "0px";
        player_html.style.top = "0px";
        canvas.parentNode.insertBefore(wrapper, canvas);
        wrapper.appendChild(canvas);
        wrapper.appendChild(player_html);

        // Don't run setup again
        gmy_init = true;
    }
}


function gmy_create(x, y, player_width, player_height, player_video, autoplay, autodestroy) {
    setup();
    
    player_html = document.getElementById("player");
    player_html.style.left = x + "px";
    player_html.style.top = y + "px";

    if (autoplay && autodestroy) {
        player = new YT.Player('player', {
            height: player_height,
            width: player_width,
            videoId: player_video,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    } 
    else if (!autoplay && autodestroy) {
        player = new YT.Player('player', {
            height: player_height,
            width: player_width,
            videoId: player_video,
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
    else if (autoplay && !autodestroy) {
        player = new YT.Player('player', {
            height: player_height,
            width: player_width,
            videoId: player_video,
            events: {
                'onReady': onPlayerReady,
            }
        });
    }
    else {
        player = new YT.Player('player', {
            height: player_height,
            width: player_width,
            videoId: player_video,
        });
    } 

    // There is a YT Object
    player_init = true; 
}

// If autoplay is not enabled this function can start the video
function gmy_start() {
    player.playVideo();
}

// Autoplay video (Will only trigger if setup)
function onPlayerReady(event) {
    event.target.playVideo();
}

// This function stops the video
function gmy_stop() {
    player.stopVideo();
}

// Autodestroy video (Will only trigger if setup)
function onPlayerStateChange(event) {        
    if(event.data == YT.PlayerState.ENDED) {            
        player.destroy();
        player_init = false;
    }
}

// Get current state of the video
//    -1 – unstarted
//    0 – ended
//    1 – playing
//    2 – paused
//    3 – buffering
//    5 – video cued
function gmy_get_state() {
    if (player_init)
        return player.getPlayerState();
    else
        return YT.PlayerState.UNSTARTED;
}

