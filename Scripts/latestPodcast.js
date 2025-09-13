async function displayLatestpodcast () {
  const res = await fetch("../Podcast_pages_html/podcastList.json");
  const podcasts = await res.json();
  
  const latest = podcasts.slice(-4);
  const container = document.getElementById("latest-podcasts");

  let podcastHTML='';

  latest.forEach(p => {
      podcastHTML += `
        <a href="Podcast_pages_html/${p.pageName}.html" target="_blank">
          <div class="podcastcontainer">
            <div class="podcast-image">
              <img src="Images/articles/${p.cover}" alt="cover_${p.pageName}">
            </div>
            <div class="podcast-titre">${p.title}</div>
          </div>
        </a>
      `;
    });
    container.innerHTML = podcastHTML;
}

displayLatestpodcast();


