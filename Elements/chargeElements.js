fetch("/french-with-felix-website/Elements/header.html")
.then(res => res.text())
.then(html => {
  document.getElementById("header").innerHTML = html;
});

fetch("/french-with-felix-website/Elements/footer.html")
.then(res => res.text())
.then(html => {
  document.getElementById("footer").innerHTML = html;
});