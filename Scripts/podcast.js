async function displayLatestpodcast () {
  const res = await fetch("/french-with-felix-website/Podcast_pages_html/podcastList.json");
  const podcasts = await res.json();
  
  const latest = podcasts.slice(-4).reverse();
  const container = document.getElementById("latest-podcasts");
  if (!container) return;

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
};

displayLatestpodcast();


async function displayAllPodcast () {
  const res = await fetch("/french-with-felix-website/Podcast_pages_html/podcastList.json");
  const podcasts = await res.json();
  const container = document.getElementById("all-podcasts");
  if (!container) return;

  const allExceptLast = podcasts.slice(0, -1).reverse();

  let podcastHTML='';

  allExceptLast.forEach(p => {
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
};

displayAllPodcast ();



async function displayLastPodcast () {
  const res = await fetch("/french-with-felix-website/Podcast_pages_html/podcastList.json");
  const podcasts = await res.json();
  const container = document.getElementById("last-podcast");
  if (!container) return;
  const last = podcasts.slice(-1)[0];

  let podcastHTML='';

  if (last) {
    podcastHTML = `
      <a href="Podcast_pages_html/${last.pageName}.html" target="_blank">
        <div class="lastpodcastcontainer">
          <div class="last-podcast-image">
            <img src="Images/articles/${last.cover}" alt="cover_${last.pageName}">
          </div>
          <div class="last-podcast-titre">${last.title}</div>
        </div>
      </a>
    `;
  }

  container.innerHTML = podcastHTML;
};

displayLastPodcast ();

