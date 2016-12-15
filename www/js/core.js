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

    $('#wait').show();

    if(nBtag == ""){
      showDialog('dialog-emptyBtag');
      $('#wait').hide();
      return;
    }

    var req = new XMLHttpRequest();
    req.open('GET', 'https://api.lootbox.eu/pc/eu/' + nBtag + '/profile', true);
    req.send(null);
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if(req.status == 200){
            var json = JSON.parse(req.responseText);
            if(json.statusCode == 404){
              showDialog('dialog-errorBtag');
              $('#wait').hide();
              return;
            }
            document.querySelector('#navigator').pushPage('page2.html');
        }
        else{
          showDialog('dialog-error');
          $('#wait').hide();
        }
      }
    };

    /*const regex = /^[\p{L}\p{Mn}][\p{L}\p{Mn}0-9]{2,11}#[0-9]{4,5}/u;
    if (regex.exec(btag) !== null) {
      document.querySelector('#navigator').pushPage('page2.html');
    }*/
};
