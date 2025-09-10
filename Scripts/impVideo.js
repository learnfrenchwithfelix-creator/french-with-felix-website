var player;

  function onYouTubeIframeAPIReady(videoId) {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId, // CHANGER LE ID
    });
  }

    


  document.addEventListener("click", function(e) {
    var p = e.target.closest("p");
    if (!p || !p.dataset.start) return; 
    if (!document.getElementById('transcript').contains(p)) return; 

    var start = parseFloat(p.dataset.start);
    if (isNaN(start)) return;

    if (player && typeof player.seekTo === "function") {
      player.seekTo(start, true);
      player.playVideo();
    }
  });