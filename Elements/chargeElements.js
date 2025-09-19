fetch("Elements/header.html")
.then(res => res.text())
.then(html => {
  document.getElementById("header").innerHTML = html;
});

fetch("Elements/footer.html")
.then(res => res.text())
.then(html => {
  document.getElementById("footer").innerHTML = html;
});