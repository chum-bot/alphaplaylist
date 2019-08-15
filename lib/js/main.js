let sortNames = [];
let songObj = [];
let videoIds = [];

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log(profile);
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
        .then(function () { console.log("Sign-in successful"); },
            function (err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey("AIzaSyC-IPYnSRfYMHvfDxlOwWcJoqLYXG9Olv4");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}


function playlistToSelect() {
    return gapi.client.youtube.playlists.list({
        "part": "snippet",
        "mine": "true"
    })
    .then(function(resp){
        console.log("Playlists", resp);
        
        for(let inside of resp.result.items){
        let thumbnail = create("img");

        thumbnail.id = "picture";
        thumbnail.src = inside.snippet.thumbnails.standard.url;
        thumbnail.addEventListener("click", execute)
        add(document.getElementById("pictureCont"), thumbnail);
        }
    })
}
function searchSong() { 
    let input = document.getElementById('searchbar').value 
    input=input.toLowerCase(); 
    let x = document.getElementsByClassName('songElem'); 
      
    for (i = 0; i < x.length; i++) {  
        if (!x[i].innerHTML.toLowerCase().includes(input)) { 
            x[i].style.display="none"; 
        } 
        else { 
            x[i].style.display="list-item";                  
        } 
    } 
} 

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.youtube.playlistItems.list({
        "part": "snippet,contentDetails",
        "maxResults": 50,
        "playlistId": "LM"
    })
        .then(function (response) {

          let playlistList = document.getElementById("playlistDisplay");
            // Handle the results here (response.result has the parsed body).

            console.log("Response", response);
            for (names of response.result.items) {

                sortNames.push(names.snippet.title);
                sortNames.sort();
                songObj.push(names);
                songObj.sort((a,b) => (a.snippet.title > b.snippet.title) ? 1 : -1);
                var videoId = names.contentDetails.videoId;
                videoIds.push(videoId);
                }
            for(i = 0; i < sortNames.length; i++){
                var song = create("li");
                var link = create("a");
                link.setAttribute("href", `https://music.youtube.com/watch?v=${songObj[i].contentDetails.videoId}&list=LM`);
                attr(link, "target", "_blank");
                attr(song, "class", "songElem");
                text(link,songObj[i].snippet.title);
                add(song, link);
                add(playlistList, song);
            }
                            
                
            },

        
            function (err) { console.error("Execute error", err); });
}
function search_songs() { 
    let input = document.getElementById('searchbar').value 
    input=input.toLowerCase(); 
    let x = document.getElementsByClassName('animals'); 
      
    for (i = 0; i < x.length; i++) {  
        if (!x[i].innerHTML.toLowerCase().includes(input)) { 
            x[i].style.display="none"; 
        } 
        else { 
            x[i].style.display="list-item";                  
        } 
    } 
} 

gapi.load("client:auth2", function () {
    gapi.auth2.init({

        client_id: "800308892691-norludnkg24jcg5m18vc6p11vppv0u9g.apps.googleusercontent.com"
    });
});

//quality of life functions
function create(elem) {
    return document.createElement(elem);
}
function text(parent, text) {
    return parent.innerText = text;
}
function add(parent, child) {
    return parent.appendChild(child);
}
function attr(parent, attr, attrName) {
    return parent.setAttribute(attr, attrName);
}