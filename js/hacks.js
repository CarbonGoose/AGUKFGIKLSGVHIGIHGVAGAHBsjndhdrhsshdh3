// hacks.js

async function loadHackPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const res = await fetch("hacks.json");
  const data = await res.json();
  const category = data.find((c) => c.id === id);

  if (!category) {
    document.body.innerHTML = "<h2>Ups! Kategori ikke fundet.</h2>";
    return;
  }

  applyCategoryStyle(category.style);

  document.getElementById("hack-title").textContent = category.name;
  document.getElementById("hack-description").textContent = category.description;
  document.getElementById("hack-icon").src = category.icon;

  const list = document.querySelector("#hack-list .container");
  list.innerHTML = "";

  const total = category.hacks.length;
  const completed = 0;
  document.getElementById("progress-fill").style.height = `${(completed / total) * 100}%`;
  document.getElementById("progress-text").textContent = `${completed} / ${total} hacks`;

  const saveKey = "savedHacks";
  const savedHackTitles = JSON.parse(localStorage.getItem(saveKey)) || [];

  category.hacks.forEach((hack) => {
    const el = document.createElement("section");
    el.className = "hack-card";

    const howto = hack.howto
      ? `<div class=\"hack-howto\"><strong>How to:</strong><br>${hack.howto.replace(/\n/g, '<br>')}</div>`
      : "";

    const extraContent = generateExtraContent(hack.extra);

    const video = hack.video
      ? `<div class=\"right\">
          <div class=\"video-wrapper collapsed\">
            <div class=\"video-inner-wrapper\">
              <video class=\"hack-video\" controls playsinline><source src=\"${hack.video}\" type=\"video/mp4\"></video>
              <button class=\"big-play\">▶</button>
            </div>
          </div>
        </div>`
      : "";

    const layout = `
      <div class=\"hack-extra-grid\">
        <div class=\"left\">
          ${howto}
          ${extraContent}
        </div>
        ${video}
      </div>
      <div class=\"hack-footer\">
        <button class=\"done-btn\">✅ I did it! </button>
      </div>
    `;

    el.innerHTML = `
      <div class=\"hack-header\">
        <h2>${hack.title}</h2>
        <p>${hack.description}</p>
        <div class=\"hack-extra\">
          ${layout}
        </div>
        <div class=\"save-tag\" data-state=\"unsaved\" title=\"Gem hack\">
          <img src=\"img/heart3.png\" alt=\"Gem\" class=\"heart-icon\">
        </div>
      </div>
    `;

    const extra = el.querySelector(".hack-extra");
    const videoWrapper = el.querySelector(".video-wrapper");
    const playBtn = el.querySelector(".big-play");
    const videoEl = el.querySelector("video");
    const leftContent = el.querySelector(".left");

    function matchVideoHeight() {
      const isMobile = window.innerWidth < 768;
      if (!videoWrapper || !leftContent) return;

      if (!isMobile && videoWrapper.classList.contains("collapsed")) {
        videoWrapper.style.maxHeight = leftContent.offsetHeight + "px";
      } else {
        videoWrapper.style.maxHeight = "none";
      }
    }

    if (videoWrapper && videoEl && playBtn) {
      matchVideoHeight();
      window.addEventListener("resize", matchVideoHeight);

      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        playBtn.style.display = "none";
        videoEl.play();
      });

      videoEl.addEventListener("play", () => {
        playBtn.style.display = "none";
        videoWrapper.classList.remove("collapsed");
        matchVideoHeight();
      });

      videoEl.addEventListener("pause", () => {
        if (!videoEl.ended && window.innerWidth >= 768) {
          playBtn.style.display = "block";
          videoWrapper.classList.add("collapsed");
          matchVideoHeight();
        }
      });

      videoEl.addEventListener("touchend", (e) => {
        if (e.target !== videoEl) return;
        e.stopPropagation();
        if (videoEl.paused) {
          videoEl.play();
        } else {
          videoEl.pause();
        }
      });
    }

    el.addEventListener("click", (e) => {
      const isInteractive = ["textarea", "button", "input", "a", "label", "img"].includes(e.target.tagName.toLowerCase()) ||
        e.target.classList.contains("save-tag") ||
        e.target.closest(".video-wrapper") ||
        e.target.closest(".hack-howto") ||
        e.target.closest(".checklist");
      if (isInteractive) return;

      const isOpen = extra.classList.contains("open");
      if (isOpen) {
        extra.classList.remove("open");
        if (videoEl) videoEl.pause();
        if (playBtn) playBtn.style.display = "block";
        if (videoWrapper && window.innerWidth >= 768) {
          videoWrapper.classList.add("collapsed");
          matchVideoHeight();
        }
      } else {
        extra.classList.add("open");
        matchVideoHeight();
      }
    });

    list.appendChild(el);

    const saveButton = el.querySelector(".save-tag");

    if (savedHackTitles.includes(hack.title)) {
      saveButton.dataset.state = "saved";
      saveButton.innerHTML = `<img src=\"img/heart2.png\" alt=\"Gemt\" class=\"heart-icon\">`;
    }

    saveButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isSaved = saveButton.dataset.state === "saved";

      let updatedTitles = [...savedHackTitles];

      if (isSaved) {
        saveButton.dataset.state = "unsaved";
        saveButton.innerHTML = `<img src=\"img/heart3.png\" alt=\"Gem\" class=\"heart-icon\">`;
        updatedTitles = updatedTitles.filter((t) => t !== hack.title);
      } else {
        saveButton.dataset.state = "saved";
        saveButton.innerHTML = `<img src=\"img/heart2.png\" alt=\"Gemt\" class=\"heart-icon\">`;
        updatedTitles.push(hack.title);
      }

      localStorage.setItem(saveKey, JSON.stringify(updatedTitles));
    });

    if (hack.extra && hack.extra.type === "checklist") {
      const checklist = el.querySelector(".checklist");
      const input = checklist.querySelector(".new-task-input");
      const button = checklist.querySelector(".add-task");
      const listEl = checklist.querySelector(".task-list");
      const key = checklist.dataset.id;

      const saved = JSON.parse(localStorage.getItem(key)) || [];

      const render = () => {
        listEl.innerHTML = "";
        saved.forEach((task, i) => {
          const li = document.createElement("li");
          li.className = task.done ? "completed" : "";
          li.innerHTML = `
            <label>
              <input type=\"checkbox\" ${task.done ? "checked" : ""}> ${task.text}
            </label>
            <button class=\"delete-task\" title=\"Slet\">✖</button>
          `;

          const checkbox = li.querySelector("input");
          checkbox.addEventListener("change", () => {
            saved[i].done = !saved[i].done;
            localStorage.setItem(key, JSON.stringify(saved));
            render();
            if (saved[i].done) showConfetti(li);
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
    }
  });
}

function showConfetti(target) {
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
}

function generateExtraContent(extra) {
  if (!extra) return "";
  if (extra.type === "notepad") {
    return `<textarea placeholder="${extra.placeholder || 'Skriv her...'}"></textarea>`;
  }
  if (extra.type === "checklist") {
    const id = "checklist-" + Math.random().toString(36).substr(2, 9);
    return `
      <div class=\"checklist\" data-id=\"${id}\">
        <input type=\"text\" placeholder=\"${extra.placeholder}\" class=\"new-task-input\" />
        <button class=\"add-task\">Add</button>
        <ul class=\"task-list\"></ul>
      </div>
    `;
  }
  return "";
}

function applyCategoryStyle(style) {
  if (!style) return;

  const root = document.documentElement;
  root.style.setProperty("--background", style.background);
  root.style.setProperty("--card", style.card);
  root.style.setProperty("--accent", style.accent);
  root.style.setProperty("--button", style.button);
  root.style.setProperty("--buttonText", style.buttonText);
  root.style.setProperty("--shadow", style.shadow);
  root.style.setProperty("--title", style.title);
  root.style.setProperty("--text", style.text);
  root.style.setProperty("--saveTag", style.saveTag);
}

document.addEventListener("DOMContentLoaded", loadHackPage);
