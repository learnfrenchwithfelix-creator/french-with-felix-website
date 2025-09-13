const fs = require('fs');
const path = require('path');

const podcastListFile = '../Podcast_pages_html/podcastList.json'; // fichier JSON pour sauvegarder le tableau
let podcastList = []; // tableau central pour stocker les pages
let podcastId = 0;  // compteur pour les IDs

// Charger les pages existantes si le JSON existe déjà
if (fs.existsSync(podcastListFile)) {
    const data = fs.readFileSync(podcastListFile, 'utf8');
    podcastList = JSON.parse(data);
    // Mettre à jour l'ID pour qu'il continue après le dernier
    podcastId = podcastList.length > 0 ? Math.max(...podcastList.map(p => p.id)) + 1 : 0;
}

// Récupérer les arguments depuis le terminal
// node createPage.js pageName "title" videoId cover transcriptFile
const [,, pageName, title, videoId, cover, transcriptFile] = process.argv;

// Vérifier que tous les arguments sont présents
if (!pageName || !title || !videoId || !cover || !transcriptFile) {
    console.error("Usage: node createPage.js pageName title videoId cover transcriptFile");
    process.exit(1);
}



function createPodcastPage({ pageName, title, videoId, cover, transcriptFile }) {
    const outputPath = `../Podcast_pages_html/${pageName}.html`;

    const contenuHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../Styles/Head.css">
  <link rel="stylesheet" href="../Styles/podcast-body.css">
  <link rel="stylesheet" href="../Styles/Footer.css">
  <title class="js-title">${title}</title>  <!-- CHANGER LE TITRE -->
</head>


<body>
<div id="header" class="homepage-header"></div>
  
<div class="podcast-body">
    
    <img src="../Images/Homepage/cover.jpg" class="podcast-topcover">


    <div class="script-container">
      
      <!-- CHANGER LE TITRE -->
      <div class="script-titre js-titre-podcast"> 
        ${title} 
      </div>


      <div class="podcast-script"  id="transcript">

      </div>
      

    </div>

    <div class="rs-container">

    <div class="player-wrapper" style="max-width:900px; width:100%;">
      <div id="player"></div>
    </div>

  </div>


</div> 

<div id="footer" class="homepage-footer"></div>

<script src="../Elements/chargeElements.js"></script>
<script src="../Scripts/srttransfo.js"></script>
<script src="../Scripts/impVideo.js"></script>

<script class="js-frameYT"> 
  
  // This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // ID Youtube
  var player;
  var videoIdToLoad = "${videoId}"; // change selon ta page

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      videoId: videoIdToLoad
    });
  }

</script>

<script class="js-srtimport">
  // CHANGER LE SRT IMPORTE
  loadTranscript('../srt/${transcriptFile}', 'transcript');
</script>

  
</body>

</html>
`;

    // Crée le fichier HTML
    fs.writeFileSync(outputPath, contenuHTML, 'utf8');
    console.log(`Page créée : ${outputPath}`);

    // Ajouter au tableau et sauvegarder dans le JSON
    const podcastObj = { id: podcastId++, pageName, title, videoId, cover, transcriptFile, outputPath };
    podcastList.push(podcastObj);

    fs.writeFileSync(podcastListFile, JSON.stringify(podcastList, null, 2), 'utf8'); // sauvegarde jolie
    console.log(`JSON mis à jour : ${podcastListFile}`);
}


createPodcastPage({ pageName, title, videoId, cover, transcriptFile });



// node createPage.js chihiro "Pourquoi vous avez aimé le voyage de Chihiro ?" rpy1qU1pAKA cover.jpg le-voyage-de-chihiro.srt