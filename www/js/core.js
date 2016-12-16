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

      $('#btnStats').append('<ons-button onclick="getStatsHero()" id="statsBH">Stats by Hero</ons-button><ons-button onclick="getAchiev()">Your achievements</ons-button>');
  }, 500)
};

var getStatsHero = function(){
  var btag = document.getElementById('btag').value;
  var nBtag = btag.replace('#', '-');

  $('#statsBH').prop("disabled", true);

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
    $('#statsBH').prop("disabled", false);
    var obj = jQuery.parseJSON(json);
    var html = "";
    $.each(obj, function(key, value){
      if(obj[key].name == "Soldier: 76"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Soldier76\')">';
      }
      else if(obj[key].name == "Torbj&#xF6;rn"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Torbjoern\')">';
      }
      else if(obj[key].name == "L&#xFA;cio"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Lucio\')">';
      }
      else if(obj[key].name == "McCree"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'Mccree\')">';
      }
      else if(obj[key].name == "D.Va"){
        html += '<ons-list-item tappable onclick="getStatsFor(\'DVa\')">';
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

    var winrate = json[hero].GamesWon * 100 / json[hero].GamesPlayed;
    winrate = Math.round(winrate * 100) / 100;

    $('#five-page .navigation-bar--material').css('background-image', 'url(\'../img/' + hero + '.jpg\')');

    $('#dataRetHeroStats').append('<div style="padding:10px;"><h1 class="tcenter">General</h1>' +
        '<p>Eliminations : ' + json[hero].Eliminations + '</p>' +
        '<p>Final blows : ' + json[hero].FinalBlows + '</p>' +
        '<p>Solo kills : ' + json[hero].SoloKills + '</p>' +
        '<p>Damage done : ' + json[hero].DamageDone + '</p>' +
        '<p>Objective kills : ' + json[hero].ObjectiveKills + '</p>' +
        '<p>Multikills (best) : ' + json[hero]["Multikill-Best"] + '</p>' +
        '<p>Kill streak (best) : ' + json[hero]["KillStreak-Best"] + '</p>' +
        '<p>Time spent on fire : ' + json[hero].TimeSpentonFire + '</p>' +
        '<p>Objective time : ' + json[hero].ObjectiveTime + '</p>' +
        '<p>Deaths : ' + json[hero].Deaths + '</p>' +
        '<p>Time played : ' + json[hero].TimePlayed + '</p>' +
        '<p>Games played : ' + json[hero].GamesPlayed + '</p>' +
        '<p>Games won : ' + json[hero].GamesWon + '</p>' +
        '<p>Games lost : ' + json[hero].GamesLost + '</p>' +
        '<p>Games tied : ' + json[hero].GamesTied + '</p>' +
        '<p>Win percentage : ' + winrate + '%</p>' +
        '<h1 class="tcenter">Medals</h1>' +
        '<p>Bronze : ' + json[hero]["Medals-Bronze"] + '</p>' +
        '<p>Silver : ' + json[hero]["Medals-Silver"] + '</p>' +
        '<p>Gold : ' + json[hero]["Medals-Gold"] + '</p>' +
        '<h1 class="tcenter">Best in Game</h1>' +
        '<p>Eliminations : ' + json[hero]["Eliminations-MostinGame"] + '</p>' +
        '<p>Final blows : ' + json[hero]["FinalBlows-MostinGame"] + '</p>' +
        '<p>Solo kills : ' + json[hero]["SoloKills-MostinGame"] + '</p>' +
        '<p>Damage done : ' + json[hero]["DamageDone-MostinGame"] + '</p>' +
        '<p>Objective kills : ' + json[hero]["ObjectiveKills-MostinGame"] + '</p>' +
        '<p>Objective time : ' + json[hero]["ObjectiveTime-MostinGame"] + '</p>' +
        '<h1 class="tcenter">Average</h1>' +
        '<p>Eliminations per life : ' + json[hero].EliminationsperLife + '</p>' +
        '<p>Eliminations most in life : ' + json[hero]["Eliminations-MostinLife"] + '</p>' +
        '<p>Damage done most in life : ' + json[hero]["DamageDone-MostinLife"] + '</p>' +
        '<p>Eliminations : ' + json[hero]["Eliminations-Average"] + '</p>' +
        '<p>Final blows : ' + json[hero]["FinalBlows-Average"] + '</p>' +
        '<p>Solo kills : ' + json[hero]["SoloKills-Average"] + '</p>' +
        '<p>Damage done : ' + json[hero]["DamageDone-Average"] + '</p>' +
        '<p>Objective kills : ' + json[hero]["ObjectiveKills-Average"] + '</p>' +
        '<p>Objective time : ' + json[hero]["ObjectiveTime-Average"] + '</p>' +
        '<p>Deaths : ' + json[hero]["Deaths-Average"] + '</p>' +
        '</div>');

    //TODO : Same in json = SoloKills-Average; DamageDone-Average; ObjectiveKills-Average; ObjectiveTime-Average; Deaths-Average;

  }, 500);
}
