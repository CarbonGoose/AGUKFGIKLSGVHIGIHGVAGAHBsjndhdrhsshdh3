
// === Pomodoro Variables ===
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".pomodoro-container")) {
    initPomodoro();
  }

  const checklist = document.querySelector(".checklist[data-id='daily-tool-todo']");
  if (checklist) renderChecklist(checklist);
});



//TO-DO LISTE (Samme fra hacks.js)
document.addEventListener("DOMContentLoaded", () => {
  const checklist = document.querySelector(".checklist[data-id='daily-tool-todo']");
  if (!checklist) return;

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
          <input type="checkbox" ${task.done ? "checked" : ""}> ${task.text}
        </label>
        <button class="delete-task" title="Slet">✖</button>
      `;

      li.querySelector("input").addEventListener("change", () => {
  saved[i].done = !saved[i].done;
  localStorage.setItem(key, JSON.stringify(saved));
  render();
  if (saved[i].done && typeof showConfetti === "function") {
    showConfetti(li);
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
});


// NOTEPAD!
document.addEventListener("DOMContentLoaded", () => {
  const noteKey = "tools-notepad";
  const textarea = document.getElementById("tools-notepad");
  if (textarea) {
    textarea.value = localStorage.getItem(noteKey) || "";
    textarea.addEventListener("input", () => {
      localStorage.setItem(noteKey, textarea.value);
    });
  }
  
});



//SPIN THE WHEEEEEL
// === RANDOM HACK SPINNER ===
document.addEventListener("DOMContentLoaded", async () => {
  const spinBtn = document.getElementById("spin-hack-btn");
  const resultBox = document.getElementById("spinner-result");

  if (!spinBtn || !resultBox) return;

  const res = await fetch("hacks.json");
  const data = await res.json();
  const allHacks = [];

  data.forEach(category => {
    category.hacks.forEach(hack => {
      allHacks.push({
        title: hack.title,
        category: category.name,
        id: category.id,
        xp: hack.xp || 5,
        icon: category.icon
      });
    });
  });

  const todayStr = new Date().toLocaleDateString("da-DK");
  const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
  const alreadySpun = logs.some(
    log => log.date === todayStr && log.hackTitle.includes("Random Hack Spinner")
  );

  spinBtn.addEventListener("click", () => {
    resultBox.innerHTML = `
      <div class="wheel-animation"></div>
      <p style="margin-top: 1rem;">🎲 Spinning the wheel...</p>
    `;
    spinBtn.disabled = true;

    setTimeout(() => {
      const randomHack = allHacks[Math.floor(Math.random() * allHacks.length)];

      // Resultatvisning
      resultBox.innerHTML = `
        <div style="display:flex;align-items:center;gap:1rem;justify-content:center;">
          <img src="${randomHack.icon}" width="50" alt="${randomHack.category}">
          <div>
            <strong>${randomHack.title}</strong><br>
            <small style="opacity:0.8;">from <em>${randomHack.category}</em></small>
          </div>
        </div>
        <button class="btn btn-outline-success mt-2" id="go-to-hack">Go to Hack</button>
      `;

      // XP kun første gang i dag
      if (!alreadySpun) {
        const username = localStorage.getItem("username") || "User";
        window.logXP({
          displayName: `Tool ${username}`,
          hackTitle: `Random Hack Spinner → ${randomHack.title}`,
          xp: randomHack.xp || 5
        });
      }

      document.getElementById("go-to-hack").addEventListener("click", () => {
        window.location.href = `hack.html?id=${randomHack.id}#${encodeURIComponent(randomHack.title)}`;
      });

      spinBtn.textContent = "🔄 Spin Again";
      spinBtn.disabled = false;
    }, 1800);
  });
});
