document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("email").value.trim();
  if (username.length === 0) return;

  localStorage.setItem("username", username);

  const remember = document.getElementById("rememberMe").checked;
  localStorage.setItem("rememberMe", remember ? "yes" : "no");

  // Redirect og reload for navbar-opdatering
  window.location.replace("frontpage.html");
});
