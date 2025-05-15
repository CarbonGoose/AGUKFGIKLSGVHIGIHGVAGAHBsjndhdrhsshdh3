// === brain.js ===

function insertNavbar(activePage = "") {
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar") || "img/ikon.png";

  const navHTML = `
  <nav class="navbar navbar-expand-lg shadow-sm px-3">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="frontpage.html">
        <img src="img/logo.png" alt="Logo" height="30" class="me-2">
        HackYourBrain
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">

          <li class="nav-item">
            <a class="nav-link ${activePage === "frontpage" ? "active" : ""}" href="frontpage.html">Hacks</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle ${activePage === "tools" ? "active" : ""}" href="#" id="toolsDropdown" role="button" data-bs-toggle="dropdown">
              Tools
            </a>
            <ul class="dropdown-menu" aria-labelledby="toolsDropdown">
              <li><a class="dropdown-item" href="#">Pomodoro Timer</a></li>
              <li><a class="dropdown-item" href="#">Habit Tracker</a></li>
              <li><a class="dropdown-item" href="#">Mood Tracker</a></li>
              <li><a class="dropdown-item" href="#">Note to Future Me</a></li>
              <li><a class="dropdown-item" href="#">Random Hack Spinner</a></li>
              <li><a class="dropdown-item" href="#">Daily Challenges</a></li>
            </ul>
          </li>

          <li class="nav-item">
            <a class="nav-link ${activePage === "quiz" ? "active" : ""}" href="#">Quiz</a>
          </li>

          <li class="nav-item">
            <a class="nav-link ${activePage === "profil" ? "active" : ""}" href="#">About us</a>
          </li>

          <li class="nav-item ms-2" id="loginArea">
            <a href="login.html" class="btn btn-outline-success">Log ind</a>
          </li>

        </ul>
      </div>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML("afterbegin", navHTML);

  if (username) {
    const loginArea = document.getElementById("loginArea");
    if (loginArea) {
      const dropdown = document.createElement("li");
      dropdown.className = "nav-item dropdown ms-2";
      dropdown.innerHTML = `
        <a class="nav-link dropdown-toggle btn btn-outline-success d-flex align-items-center gap-2" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${avatar}" alt="avatar" class="rounded-circle" width="28" height="28" style="object-fit: cover;">
          <span>${username}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="profile.html">My profile</a></li>
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logout">Log out</a></li>
        </ul>
      `;
      loginArea.replaceWith(dropdown);

      dropdown.querySelector("#logout").addEventListener("click", () => {
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        localStorage.removeItem("rememberMe");
        location.reload();
      });
    }
  }
}