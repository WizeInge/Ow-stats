var showDialog = function(id) {
  document
    .getElementById(id)
    .show();
};

var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};

var verifyBtag = function() {
    var page = event.target;
    var btag = document.getElementById('btag').value;
    var nBtag = btag.replace('#', '-');
    var verif = new RegExp(/^[A-Za-z0-9]{2,11}#[0-9]{4,5}$/u);

    $('#wait').show();

    if(btag == ""){
      showDialog('dialog-emptyBtag');
      $('#wait').hide();
      return;
    }
    else{
      if(verif.test(btag)){
        $.ajax({
          url: 'https://api.lootbox.eu/pc/eu/' + nBtag + '/profile',
          type: 'GET',
          success: function(json){
            document.querySelector('#navigator').pushPage('page2.html');
            construcPage2(json);
            $('#wait').hide();
          }
        });
      }
      else{
        showDialog('dialog-emptyBtag');
        $('#wait').hide();
        return;
      }
    }
};

var construcPage2 = function(json){
  setTimeout(function(){
    $('#wait2').hide();
    var ratio = json.data.games.competitive.wins / json.data.games.competitive.lost;
    ratio = Math.round(ratio*100)/100;
    $('#dataRet').append('<div class="tcenter"><img src="' + json.data.avatar + '" class="iconPlayer"/>' +
      '<p>'+ json.data.username + ' lvl ' + json.data.level + '</p>' +
      '<img src="' + json.data.competitive.rank_img + '" class="iconRank"/><p style="margin-bottom:20px;">' + json.data.competitive.rank + ' - ' + json.data.playtime.competitive + ' of play.</p></div>' +
      '<div class="divider"></div>' +
      '<h1 class="tcenter">Competitve</h1><div class="gridDiv">'+
      '<p>Played : ' + json.data.games.competitive.played + '</p><p><span style="color:#3fa53f">Wins</span> : ' + json.data.games.competitive.wins + '</p><p><span style="color:#8a2a2a">Lost</span> : ' + json.data.games.competitive.lost + '</p><p>Ratio (W/L) : ' + ratio + '</p></div>');
  }, 500)
}
