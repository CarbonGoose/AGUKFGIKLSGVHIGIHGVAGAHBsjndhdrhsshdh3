// === brain.js ===

// 💖 Heart Save System – used to manage "favorite" hacks (hearts)

const saveKey = "savedHacks";

window.isHackSaved = function(title) {
  const saved = JSON.parse(localStorage.getItem(saveKey)) || [];
  return saved.includes(title);
};

window.toggleHackSave = function(title) {
  let saved = JSON.parse(localStorage.getItem(saveKey)) || [];

  if (saved.includes(title)) {
    saved = saved.filter(t => t !== title);
  } else {
    saved.push(title);
  }

  localStorage.setItem(saveKey, JSON.stringify(saved));
  return saved.includes(title);
};


// ✅ XP Calculation + Progress Bar
// Calculates level, XP within level, and updates progress bar and XP text on both profile and frontpage
window.updateXPBar = function() {
  const xp = parseInt(localStorage.getItem("xp") || "0");
  const level = Math.floor(xp / 300) + 1;
  const nextLevelXP = level * 300;
  const xpInLevel = xp % 300;
  const percent = (xpInLevel / nextLevelXP) * 100;

  // 🧠 Profilside
  const xpBar = document.getElementById("xp-bar");
  const xpText = document.getElementById("xp-text");
  const levelText = document.getElementById("user-level");

  if (xpBar) xpBar.style.width = `${percent}%`;
  if (xpText) xpText.textContent = `${xpInLevel} XP out of ${nextLevelXP} XP`;
  if (levelText) levelText.textContent = level;

  // 🌞 Frontpage
  const frontBar = document.getElementById("xp-bar-front");
  const frontText = document.getElementById("xp-text-front");
  const frontLevel = document.getElementById("user-level-front");

  if (frontBar) frontBar.style.width = `${percent}%`;
  if (frontText) frontText.textContent = `${xpInLevel} XP out of ${nextLevelXP} XP`;
  if (frontLevel) frontLevel.textContent = level;
};




// === NAVIGATION BAR ===
// Dynamically inserts the navbar depending on current user login state and active page

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
            <a class="nav-link ${activePage === "frontpage" ? "active" : ""}" href="frontpage.html#hacks-section">Hacks</a>
          </li>

          <li class="nav-item">
            <a class="nav-link ${activePage === "tools" ? "active" : ""}" href="tools.html">Tools</a>
          </li>

          <li class="nav-item">
            <a class="nav-link ${activePage === "quiz" ? "active" : ""}" href="quiz.html">Quiz</a>
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



// 💡 Checklist rendering med XP
// Loads and displays saved checklist items from localStorage, and logs XP when user checks one off

window.renderChecklist = function(checklistElement) {
  const input = checklistElement.querySelector(".new-task-input");
  const button = checklistElement.querySelector(".add-task");
  const listEl = checklistElement.querySelector(".task-list");
  const key = checklistElement.dataset.id;

  const saved = JSON.parse(localStorage.getItem(key)) || [];

  const render = () => {
    listEl.innerHTML = "";
    saved.forEach((task, i) => {
      const li = document.createElement("li");
      li.className = task.done ? "completed" : "";
      li.innerHTML = `
        <label>
          <input type="checkbox" ${task.done ? "checked" : ""}> ${task.text}
        </label>
        <button class="delete-task" title="Slet">✖</button>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", () => {
        saved[i].done = !saved[i].done;
        localStorage.setItem(key, JSON.stringify(saved));
        render();
        if (saved[i].done && typeof showConfetti === "function") {
          showConfetti(li);

          const username = localStorage.getItem("username") || "User";
          const location = window.location.pathname.includes("tools.html") ? "Tool" : "Hack";
          const title = checklistElement.closest(".hack-card")?.querySelector("h2")?.textContent || "To-Do List";

          const logEntry = {
            date: new Date().toLocaleDateString("da-DK"),
            displayName: `${location} ${username}`,
            hackTitle: title,
            note: saved[i].text,
            xp: 4
          };

          const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
          logs.push(logEntry);
          localStorage.setItem("xpLogs", JSON.stringify(logs));

          let xp = parseInt(localStorage.getItem("xp") || "0");
          localStorage.setItem("xp", xp + logEntry.xp);

          if (typeof updateXPBar === "function") updateXPBar();
        }
      });

      li.querySelector(".delete-task").addEventListener("click", (e) => {
        e.stopPropagation();
        saved.splice(i, 1);
        localStorage.setItem(key, JSON.stringify(saved));
        render();
      });

      listEl.appendChild(li);
    });
  };

  render();

  button.addEventListener("click", () => {
    if (input.value.trim()) {
      saved.push({ text: input.value.trim(), done: false });
      localStorage.setItem(key, JSON.stringify(saved));
      input.value = "";
      render();
    }
  });
};


// 🎉 Confetti Animation
// Called when XP is earned (e.g., task complete) – visually rewarding feedback

window.showConfetti = function(target) {
  const container = document.createElement("div");
  container.className = "confetti";
  document.body.appendChild(container);

  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${Math.random() * 30}vh`;
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 1500);
};


// 🧠 Dynamic Extra Content Generator
// Used to insert notepads, checklists, or embedded tools (pomodoro) inside hacks/tools

window.generateExtraContent = function(extra) {
  if (!extra) return "";

  if (extra.type === "notepad") {
    return `<textarea placeholder="${extra.placeholder || 'Skriv her...'}"></textarea>`;
  }

  if (extra.type === "checklist") {
    const id = "checklist-" + Math.random().toString(36).substr(2, 9);
    return `
      <div class="checklist" data-id="${id}">
        <div class="input-row">
          <input type="text" placeholder="${extra.placeholder}" class="new-task-input" />
          <button class="add-task">Add</button>
        </div>
        <ul class="task-list"></ul>
      </div>
    `;
  }

  if (extra.type === "tool" && extra.toolId === "pomodoro") {
    return `
      <div class="pomodoro-container">
        <img src="img/pomodorodyr4.png" class="pomodoro-base" alt="Pomodoro base">

        <div class="pomodoro-circle">
          <div id="timer-label" class="timer-label">Focus Time</div>
          <div class="timer" id="timer">25:00</div>
          <button id="startBtn" class="pomodoro-btn">Start</button>
          <div class="settings-icon" id="openSettings">⚙️</div>
        </div>

        <img src="img/pomodorodyrhat1.png" class="pomodoro-hat" alt="Pomodoro hat">

        <div class="pomodoro-settings-popup" id="settingsPopup">
          <label>Work: <input type="number" id="workInput" value="25"></label>
          <label>Break: <input type="number" id="breakInput" value="5"></label>
          <button id="resetBtn">🔁 Reset</button>
          <label class="audio-toggle">
            🔈Audio <input type="checkbox" id="soundToggle">
          </label>
        </div>
      </div>
    `;
  }

  return "";
};

// 🍅 Pomodoro Timer
// Full focus/break timer logic, with sound, XP logging, and custom work/break duration.

window.initPomodoro = function () {
  const timerEl = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const workInput = document.getElementById("workInput");
  const breakInput = document.getElementById("breakInput");
  const label = document.getElementById("timer-label");

  if (!timerEl || !startBtn || !resetBtn || !workInput || !breakInput || !label) return;

  let timerRunning = false;
  let isBreak = false;
  let timeLeft = parseInt(workInput.value) * 60;
  let interval = null;

  const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    timerEl.textContent = `${minutes}:${seconds}`;
    label.textContent = isBreak ? "Break Time" : "Focus Time";
  };

  const startTimer = () => {
    timerRunning = true;
    interval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        if (document.getElementById("soundToggle")?.checked) {
          const audio = new Audio("sound/plinPLING.mp3");
          audio.play();
        }

        if (!isBreak) {
          const username = localStorage.getItem("username") || "User";
          const log = {
            date: new Date().toLocaleDateString("da-DK"),
            displayName: `Tool ${username}`,
            hackTitle: "Pomodoro Timer",
            note: "",
            xp: 5
          };

          const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
          logs.push(log);
          localStorage.setItem("xpLogs", JSON.stringify(logs));

          let xp = parseInt(localStorage.getItem("xp") || "0");
          localStorage.setItem("xp", xp + 5);

          if (typeof updateXPBar === "function") updateXPBar();
          if (typeof showConfetti === "function") showConfetti();
        }

        isBreak = !isBreak;
        timeLeft = (isBreak ? parseInt(breakInput.value) : parseInt(workInput.value)) * 60;
        updateTimerDisplay();
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(interval);
    interval = null;
    timerRunning = false;
  };

  const resetTimer = () => {
    pauseTimer();
    isBreak = false;
    timeLeft = parseInt(workInput.value) * 60;
    updateTimerDisplay();
    startBtn.textContent = "Start";
  };

  startBtn.addEventListener("click", () => {
    if (timerRunning) {
      pauseTimer();
      startBtn.textContent = "Start";
    } else {
      startTimer();
      startBtn.textContent = "Pause";
    }
  });

  resetBtn.addEventListener("click", resetTimer);

  workInput.addEventListener("input", () => {
    if (!timerRunning && !isBreak) {
      timeLeft = parseInt(workInput.value) * 60;
      updateTimerDisplay();
    }
  });

  breakInput.addEventListener("input", () => {
    if (!timerRunning && isBreak) {
      timeLeft = parseInt(breakInput.value) * 60;
      updateTimerDisplay();
    }
  });

  // Tandhjul toggle
  const settingsBtn = document.getElementById("openSettings");
  const settingsPopup = document.getElementById("settingsPopup");
  if (settingsBtn && settingsPopup) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsPopup.classList.toggle("visible");
      settingsPopup.style.display = settingsPopup.classList.contains("visible") ? "flex" : "none";
    });

    document.addEventListener("click", (e) => {
      if (!settingsPopup.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPopup.classList.remove("visible");
        settingsPopup.style.display = "none";
      }
    });
  }

  updateTimerDisplay();
};


// === Footer Inserter ===
// Dynamically inserts a universal footer with links and credits

function insertFooter() {
  const footerHTML = `
    <footer class="text-center py-4">
      <a href="frontpage.html">Home</a> | 
      <a href="mailto:contact@hackyourbrain.com">Email us</a> |
      <a href="https://forms.gle/Gx1Jd38qknz4dMoo6">Give Feedback</a> | 
      <a href="quiz.html">Take our Quiz</a>
      <br>
      <span style="font-size: 0.85rem; opacity: 0.6;">Made with ❤️ and 🧠 – 2025</span>

    </footer>
  `;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
}
window.insertFooter = insertFooter;



// 📓 XP Logger
// Called to log XP into localStorage + update XP bar + show confetti. Used across site.
window.logXP = function({ displayName, hackTitle, note = "", xp = 5 }) {
  const logEntry = {
    date: new Date().toLocaleDateString("da-DK"),
    displayName,
    hackTitle,
    note,
    xp
  };

  const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
  logs.push(logEntry);
  localStorage.setItem("xpLogs", JSON.stringify(logs));

  let currentXP = parseInt(localStorage.getItem("xp") || "0");
  localStorage.setItem("xp", currentXP + xp);

  if (typeof window.updateXPBar === "function") updateXPBar();
  if (typeof window.showConfetti === "function") showConfetti();
};



// === SEO Inserter ===
// Dynamically adds meta tags for better search engine visibility and social sharing

function insertSEO(page) {
  const head = document.head;

  const seoData = {
    frontpage: {
      title: "How to Hack Your Brain – Gamify Your Productivity",
      description: "Take the quiz to discover your brain mode and unlock productivity hacks tailored to your motivation style – from Chaos Goblin to Gentle Fairy.",
    },
    hack: {
      title: "Brain Hacks by Category – Boost Your Focus",
      description: "Explore productivity hacks based on your brain mode. Each category includes tools, tips, and XP rewards. Perfect for ADHD minds and creative chaos.",
    },
    tools: {
      title: "Tools for Focus and Self-Care",
      description: "Explore practical, reflective, and fun tools for better focus, time management, and brain-friendly routines. Includes Pomodoro, mood tracker, and more.",
    },
    quiz: {
      title: "Brain Mode Quiz – Find Your Focus Style",
      description: "Take this fun quiz to discover your unique brain mode and get matched with productivity hacks tailored to your vibe.",
    },
    profile: {
      title: "Your Profile – Track Your Progress & XP",
      description: "View your favorite hacks, achievements, goals, and XP. This is your dashboard for self-motivation and daily brain wins.",
    },
    login: {
      title: "Login – HackYourBrain",
      description: "Log in to save your progress, customize your profile, and collect XP by completing hacks.",
    }
  };

  const meta = seoData[page];
  if (!meta) return;

  document.title = meta.title;

  const metaDesc = document.createElement("meta");
  metaDesc.name = "description";
  metaDesc.content = meta.description;
  head.appendChild(metaDesc);

  // Open Graph + Twitter Tags
  const ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property", "og:title");
  ogTitle.content = meta.title;
  head.appendChild(ogTitle);

  const ogDesc = document.createElement("meta");
  ogDesc.setAttribute("property", "og:description");
  ogDesc.content = meta.description;
  head.appendChild(ogDesc);

  const twitterTitle = document.createElement("meta");
  twitterTitle.setAttribute("name", "twitter:title");
  twitterTitle.content = meta.title;
  head.appendChild(twitterTitle);

  const twitterDesc = document.createElement("meta");
  twitterDesc.setAttribute("name", "twitter:description");
  twitterDesc.content = meta.description;
  head.appendChild(twitterDesc);
}

window.insertSEO = insertSEO;
