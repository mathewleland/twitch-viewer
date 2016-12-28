// var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
var streamers = ["freecodecamp"];
var APIKey = "9yrk10zakyb00jqtqkjfzuutoy9yuyo";

var showFeatured = function() {
  var featAPI = 'https://api.twitch.tv/kraken/streams/featured?client_id=9yrk10zakyb00jqtqkjfzuutoy9yuyo&limit=10';
  $.getJSON(featAPI, function(data){
    $.each(data.featured, function(idx, val){
      buildCard(val.stream.channel.display_name);
    });
  });
};

var buildCard = function(current) {
  var API = 'https://api.twitch.tv/kraken/streams/' + current + '?client_id=' + APIKey;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      var data = JSON.parse(xmlhttp.responseText);

      if (data.stream == null) {
         buildOfflineCard(current);
      }
      else {
        data = data.stream.channel;
        var cardHTML = '<div class="col-xs-12 col-sm-4"><div class="cardd">';
        cardHTML += '<a class="img-card" href="' + data.url + '" target="_blank">';
        cardHTML += '<img src="' + data.logo + '"/></a>';
        cardHTML += '<br /><div class="card-content">';
        cardHTML += '<h4 class="card-title">';
        if (data.display_name.length < 32) { // truncate the title if it is too long
          cardHTML += '<a href="' + data.url + '" target="_blank"> ' + data.display_name + '</a></h4>';
        }
        else {
          cardHTML += '<a href="' + data.url + '" target="_blank"> ' + data.display_name.slice(0,25) + '...</a></h4>'
        }
        if (data.status.length < 80 || data.status == null) { //truncate the extract if it is too long
          cardHTML += '<div class="cardDescription">' + data.status + '</div>';
        }
        else {
          cardHTML += '<div class="cardDescription">' + data.status.slice(0,75) + '...</div>'
        }
        cardHTML += '<div class="card-read-more">';
        cardHTML += '<a class="btn btn-link btn-block" href=" ' + data.url + '" target="_blank" style="color:green"> Watch Live! </a></div></div></div>';

        // console.log("the getJSON function was evaluated")
        // console.log(cardHTML);
        $('#resultCards').append(cardHTML);
      }

    }
    else if (xmlhttp.readyState == 4 && xmlhttp.status == 404){
      alert("no account for user " + current);
    }

  };

  xmlhttp.open("GET", API, true);
  xmlhttp.send();
}

var buildOfflineCard = function(current) {
  //if this doesn't work, just build a card without the image and status
  var API = 'https://api.twitch.tv/kraken/channels/' + current + '?client_id=' + APIKey;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      var data = JSON.parse(xmlhttp.responseText);

      console.log(data);

      var cardHTML = '<div class="col-xs-12 col-sm-4"><div class="cardd">';
      cardHTML += '<a class="img-card" href="' + data.url + '" target="_blank">';
      cardHTML += '<img src="' + data.logo + '"/></a>';
      cardHTML += '<br /><div class="card-content">';
      cardHTML += '<h4 class="card-title">';
      if (data.display_name.length < 32) { // truncate the title if it is too long
        cardHTML += '<a href="' + data.url + '" target="_blank"> ' + data.display_name + '</a></h4>';
      }
      else {
        cardHTML += '<a href="' + data.url + '" target="_blank"> ' + data.display_name.slice(0,25) + '...</a></h4>'
      }
      if (data.status.length < 80 || data.status == null) { //truncate the extract if it is too long
        cardHTML += '<div class="cardDescription">' + data.status + '</div>';
      }
      else {
        cardHTML += '<div class="cardDescription">' + data.status.slice(0,75) + '...</div>'
      }
      cardHTML += '<div class="card-read-more">';
      cardHTML += '<a class="btn btn-link btn-block" href=" ' + data.url + '" target="_blank" style="color:red"> Stream is offline </a></div></div></div>';

      $('#resultCards').append(cardHTML);


    }
  };

  xmlhttp.open("GET", API, true);
  xmlhttp.send();
};

document.getElementById("clearAll").addEventListener("click", function(){ document.getElementById("resultCards").innerHTML = ''});

$(document).ready(function(){

  for (idx in streamers) {
    var current = streamers[idx];
    // console.log(current);
    buildCard(current);
  }

  $('#lookup').keypress(function(key) {
    if (key.which==13){
      console.log("enter was clicked");
      var current = document.getElementById("lookup").value;
      buildCard(current);
    }
  });

  $('#featured').click(function(){
    showFeatured();
  });

}); //document ready
