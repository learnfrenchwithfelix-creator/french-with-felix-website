
function loadTranscript(srtFile, containerId) {
  fetch(srtFile)
    .then(res => res.text())
    .then(srt => renderTranscript(srt, containerId))
    .catch(err => console.error("Erreur lors du chargement du fichier :", err));
}

function TimeToSeconds(time) {
  const [h, m, s] = time.split(":");
  const [sec, ms] = s.split(",");
  return (+h) * 3600 + (+m) * 60 + (+sec) + (+ms) / 1000; /* Convertit tout en secondes */
}

function parseSRT(srt) {
  // Normaliser les retours de ligne (\r\n ou \r en simple \n)
  const blocks = srt.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split(/\n\n+/);

  return blocks.map(block => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);

    if (lines.length < 2) return null;

    // La ligne 0 = numéro, la ligne 1 = timecodes
    const times = lines[1].split(" --> ");
    const start = TimeToSeconds(times[0].trim());

    // Le texte = toutes les lignes à partir de la 3ème
    const text = lines.slice(2).join("\n");

    return { start, text };
  }).filter(Boolean);
}

function renderTranscript(srt, containerId) {
  const transcript = parseSRT(srt);
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  transcript.forEach(({ start, text }) => {
    const p = document.createElement("p");
    p.dataset.start = Math.floor(start);

    // Ajoute le timecode mm:ss au début du texte
    p.textContent = `[${formatTime(start)}] ${text}`;

    container.appendChild(p);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

