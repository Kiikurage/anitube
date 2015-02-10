function draw(ids) {
  ls = ids;
  idx = 0;
  setTitle(idx);

  var id = ls[0].id;
  V.height = "480px";
  swfobject.embedSWF(
      "http://www.youtube.com/v/"+id+"?enablejsapi=1&autoplay=1&playerapiid=player"
      , "V", "450", "320", "8", null, null
      , { allowScriptAccess: "always" }, { id: "player" }); 
  
  // where video
  D.style.display = "block";
  W.style.display = "block";
}

function onYouTubePlayerReady() {
  player.addEventListener('onStateChange', 'onStateChange');
  player.addEventListener('onError', 'onError');
}

function onStateChange(newState) { if (newState == 0) next(); }
function onError(st) { next(); }

function load() {
  setTitle(idx);
  if (idx in ls) {
    player.loadVideoById(ls[idx].id);
  } else {
    ytExit();
  }
}

function setTitle() {
  if (idx in ls) {
    W.innerHTML = "<a onclick='showMenu()'>" + ls[idx].name + "</a>";
  } else {
    W.innerHTML = "push ``play''";
  }
}

function showMenu() {
  if (!(idx in ls)) return;
  var tori = "<img src='../img/Twitter_logo_blue.png' height='14px' width='14px' onclick='tw()'>"
    , prev = "<a onclick='prev()'>≪prev</a>"
    , next = "<a onclick='next()'>next≫</a>"
    , cancel = "<a onclick='setTitle()'>cancel</a>"
    , exit = "<a onclick='ytExit()' style='margin-left:32%'>exit</a>";
  W.innerHTML = prev + ' ' + next + ' ' + tori + ' ' + cancel + ' ' + exit;;
}

function prev() { --idx; if (idx < 0) idx = ls.length-1;  load() }
function next() { ++idx; if (idx >= ls.length) idx = 0; load() }

function tw() {
  if (!(idx in ls)) return;
  var id = ls[idx].id
    , name = encodeURIComponent( ls[idx].name );
  var url = "https://twitter.com/intent/tweet?url=http://youtu.be/" + id +
      "&text=" + name + ":&via=youtube";
  open(url);
  setTitle();
}

