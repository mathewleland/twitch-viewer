// const streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
const streamers = ["freecodecamp"];
const APIKey = "9yrk10zakyb00jqtqkjfzuutoy9yuyo";

const showFeatured = () => {
  const featAPI = 'https://api.twitch.tv/kraken/streams/featured?client_id=9yrk10zakyb00jqtqkjfzuutoy9yuyo&limit=10';
  $.getJSON(featAPI, (data) => {
    $.each(data.featured, (idx, val) => {
      buildCard(val.stream.channel.display_name);
    });
  });
};

const buildCard = (current) => {
  const API = `https://api.twitch.tv/kraken/streams/${current}?client_id=${APIKey}`;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      let data = JSON.parse(xmlhttp.responseText);

      if (data.stream == null) {
         buildOfflineCard(current);
      }
      else {
        data = data.stream.channel;
        let cardHTML = `<div class="col-xs-12 col-sm-4"><div class="cardd">
                        <a class="img-card" href="${data.url}" target="_blank">
                        <img src="${data.logo}"/></a>
                        <br /><div class="card-content">
                        <h4 class="card-title">`

        if (data.display_name.length < 32) { // truncate the title if it is too long
          cardHTML += `<a href="${data.url}" target="_blank">${data.display_name}</a></h4>`;
        }
        else {
          cardHTML += `<a href="${data.url}" target="_blank">${data.display_name.slice(0,25)}...</a></h4>`
        }
        if (data.status.length < 80 || data.status == null) { //truncate the extract if it is too long
          cardHTML += `<div class="cardDescription">${data.status}</div>`;
        }
        else {
          cardHTML += `<div class="cardDescription">${data.status.slice(0,75)}...</div>`
        }
        cardHTML += `<div class="card-read-more">
                    <a class="btn btn-link btn-block" href="${data.url}" target="_blank" style="color:green"> Watch Live! </a></div></div></div>`;

        // console.log("the getJSON function was evaluated")
        // console.log(cardHTML);
        $('#resultCards').append(cardHTML);
      }

    }
    else if (xmlhttp.readyState == 4 && xmlhttp.status == 404){
      alert(`no account for user ${current}`);
    }

  };

  xmlhttp.open("GET", API, true);
  xmlhttp.send();
}

const buildOfflineCard = (current) => {
  //if this doesn't work, just build a card without the image and status
  const API = `https://api.twitch.tv/kraken/channels/${current}?client_id=${APIKey}`;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      const data = JSON.parse(xmlhttp.responseText);

      console.log(data);

      let cardHTML = `<div class="col-xs-12 col-sm-4"><div class="cardd">
                      <a class="img-card" href="${data.url}" target="_blank">
                      <img src="${data.logo}"/></a>
                      <br /><div class="card-content">
                      <h4 class="card-title">`
      if (data.display_name.length < 32) { // truncate the title if it is too long
        cardHTML += `<a href="${data.url}" target="_blank">${data.display_name}</a></h4>`
      }
      else {
        cardHTML += `<a href="${data.url}" target="_blank">${data.display_name.slice(0,25)}...</a></h4>`
      }
      if (data.status.length < 80 || data.status == null) { //truncate the extract if it is too long
        cardHTML += `<div class="cardDescription">${data.status}</div>`;
      }
      else {
        cardHTML += `<div class="cardDescription">${data.status.slice(0,75)}...</div>`
      }
      cardHTML += '<div class="card-read-more">';
      cardHTML += '<a class="btn btn-link btn-block" href="${data.url}" target="_blank" style="color:red"> Stream is offline </a></div></div></div>';

      $('#resultCards').append(cardHTML);

    }
  };

  xmlhttp.open("GET", API, true);
  xmlhttp.send();
};

document.getElementById("clearAll").addEventListener("click", () =>  document.getElementById("resultCards").innerHTML = '' );

$(document).ready(function(){

  for (idx in streamers) {
    const current = streamers[idx];
    buildCard(current);
  }

  $('#lookup').keypress( (key) => {
    if (key.which==13){
      const current = document.getElementById("lookup").value;
      buildCard(current);
    }
  });

  $('#featured').click(() => {
    showFeatured();
  });

}); //document ready
