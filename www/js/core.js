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
    $('ons-toolbar #profileTitle').append(document.getElementById('btag').value);

    var ratio = json.data.games.competitive.wins / json.data.games.competitive.lost;
    var winrate = json.data.games.competitive.wins * 100 / json.data.games.competitive.played;

    ratio = Math.round(ratio * 100) / 100;
    winrate = Math.round(winrate * 100) / 100;

    $('#dataRetProfile').append('<div class="tcenter"><img src="' + json.data.avatar + '" class="iconPlayer"/>' +
      '<p>LvL ' + json.data.level + '</p>' +
      '<img src="' + json.data.competitive.rank_img + '" class="iconRank"/><p style="margin-bottom:20px;">' + json.data.competitive.rank + '</p></div>' +
      '<div class="divider"></div>' +
      '<h1 class="tcenter">Competitve</h1><div class="gridDiv">'+
      '<p>Played : ' + json.data.games.competitive.played + '</p><p><span style="color:#3fa53f">Wins</span> : ' + json.data.games.competitive.wins + '</p><p><span style="color:#8a2a2a">Lost</span> : ' + json.data.games.competitive.lost + '</p><p>Ratio (W/L) : ' + ratio + '</p>' +
      '<p>Winrate : ' + winrate + '%</p>' +
      '<br />' +
      '<p>Playtime : ' + json.data.playtime.competitive + '</div>');

      $('#btnStats').append('<ons-button onclick="getStatsHero()">Stats by Hero</ons-button><ons-button onclick="getAchiev()">Your achievements</ons-button>');
  }, 500)
};

var getStatsHero = function(){
  var btag = document.getElementById('btag').value;
  var nBtag = btag.replace('#', '-');

  $.ajax({
    url: 'https://api.lootbox.eu/pc/eu/' + nBtag + '/competitive/heroes',
    type: 'GET',
    success: function(json){
      document.querySelector('#navigator').pushPage('page3.html');
      construcPage3(json);
    }
  });
};

var construcPage3 = function(json){
  setTimeout(function(){
    var obj  = jQuery.parseJSON( json );
    var html = "";
    $.each(obj, function(key, value){
      if(obj[key].name == "Soldier: 76"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Soldier76\')">';
      }
      else if(obj[key].name == "Torbjörn"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Torbjoern\')">';
      }
      else if(obj[key].name == "Lúcio"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Lucio\')">';
      }
      else{
        html += '<ons-list-item tappable onclick="getStatsFor(\'' + obj[key].name + '\')">';
      }

      html += '<div class="left"><img class="list__item__thumbnail" src="' + obj[key].image + '"></div>' +
        '<div class="center"><span class="list__item__title">' + obj[key].name + '</span><span class="list__item__subtitle">Playtime : ' + obj[key].playtime + '</span></div></ons-list-item>';
    });

    $('#dataRetHero').append(html);
  }, 500)
};

var getStatsFor = function(hero){
  var btag = document.getElementById('btag').value;
  var nBtag = btag.replace('#', '-');

  $.ajax({
    url: 'https://api.lootbox.eu/pc/eu/' + nBtag + '/competitive/hero/' + hero + '/',
    type: 'GET',
    success: function(json){
      document.querySelector('#navigator').pushPage('page5.html');
      construcPage5(json, hero);
    }
  });
}

var construcPage5 = function(json, hero){
  setTimeout(function(){
    $('ons-toolbar #heroStatTitle').append(hero);

    $('#dataRetHeroStats').append();

    //TODO : Same in json = Eliminations; FinalBlows; SoloKills; DamageDone; ObjectiveKills; Multikills; EliminationsperLife; Eliminations-MostinLife;
    //                      DamageDone-MostinLife; KillStreak-Best; DamageDone-MostinGame; Eliminations-MostinGame; FinalBlows-MostinGame;
    //                      ObjectiveKills-MostinGame; ObjectiveTime-MostinGame; SoloKills-MostinGame; Deaths-Average; SoloKills-Average;
    //                      ObjectiveTime-Average; ObjectiveKills-Average; FinalBlows-Average; Eliminations-Average; DamageDone-Average;
    //                      Deaths; Medals-Bronze; Medals-Silver; Medals-Gold; TimePlayed; GamesPlayed; GamesWon; ObjectiveTime; TimeSpentonFire;
    //                      WinPercentage (a faire soi même % chelou sur l'api = win * 100 / tot); Multikill-Best; GamesTied; GamesLost;

  }, 500);
}
