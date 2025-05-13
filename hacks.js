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
  const completed = 0; // future: count completed via localStorage
  document.getElementById("progress-fill").style.height = `${(completed / total) * 100}%`;
  document.getElementById("progress-text").textContent = `${completed} / ${total} hacks`;

  category.hacks.forEach((hack) => {
    const el = document.createElement("section");
    el.className = "hack-card";

    const howto = hack.howto
      ? `<div class="hack-howto"><strong>Sådan gør du:</strong><br>${hack.howto.replace(/\n/g, '<br>')}</div>`
      : "";

    el.innerHTML = `
      <div class="hack-header">
        <h2>${hack.title}</h2>
        <p>${hack.description}</p>
        <div class="hack-extra" style="display:none;">
          ${howto}
          ${generateExtraContent(hack.extra)}
        </div>
        <button>Gem Hack</button>
      </div>
    `;

    el.addEventListener("click", (e) => {
      const isInteractive = ["textarea", "button", "input", "a", "label"].includes(e.target.tagName.toLowerCase());
      if (isInteractive) return;

      const extra = el.querySelector(".hack-extra");
      const isOpen = extra.classList.contains("open");

      if (isOpen) {
        extra.classList.remove("open");
        setTimeout(() => (extra.style.display = "none"), 300);
      } else {
        extra.style.display = "block";
        setTimeout(() => extra.classList.add("open"), 10);
      }
    });

    list.appendChild(el);

    // 🧠 Init checklist
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
              <input type="checkbox" ${task.done ? "checked" : ""}> ${task.text}
            </label>
            <button class="delete-task" title="Slet">✖</button>
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

    // Tilfældig placering
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${Math.random() * 30}vh`;

    // Tilfældig farve
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
      <div class="checklist" data-id="${id}">
        <input type="text" placeholder="${extra.placeholder}" class="new-task-input" />
        <button class="add-task">Tilføj</button>
        <ul class="task-list"></ul>
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
}

window.onload = loadHackPage;