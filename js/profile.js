// profile.js

// === DOMContentLoaded ===
// 📦 Wait until DOM is fully loaded before executing profile logic
document.addEventListener("DOMContentLoaded", async () => {
// 👤 Get the username from localStorage or show default
  const username = localStorage.getItem("username") || "Brugernavn";
  document.getElementById("profile-username").textContent = username;

  // 💡 Vis brainType
// 🧠 Get saved brainType from quiz result
  const brainType = localStorage.getItem("brainType");
  if (brainType) {
    const typeEl = document.getElementById("brain-type");
// ✨ Define descriptions and icons for each brainType
    const descriptions = {
      "Gentle": "🩷 Soft selfcare and kindness for tough days",
      "Discipline": "💼 Structure and no-nonsense focus",
      "Chaos": "🎲 Dopamine-fueled goblin energy!",
      "Sunshine": "☀️ Joyful vibes and feel-good motivation",
      "Gamified": "🎮 XP, quests, and productivity loot",
      "Meta": "👁️ Mindfulness, purpose and reflection",
      "Classic": "🌱 Practical and effective old-school tricks",
      "Dark": "💀 Existential truths and shadow-fueled action"
    };

    const emojis = {
      "Gentle": "🩷",
      "Discipline": "💼",
      "Chaos": "🎲",
      "Sunshine": "☀️",
      "Gamified": "🎮",
      "Meta": "👁️",
      "Classic": "🌱",
      "Dark": "💀"
    };

    const badgeIcon = {
      "Gentle": "img/gentle1.png",
      "Discipline": "img/discipline1.png",
      "Chaos": "img/chaos1.png",
      "Sunshine": "img/sunshine.png",
      "Gamified": "img/gamified1.png",
      "Meta": "img/meta12.png",
      "Classic": "img/classic2.png",
      "Dark": "img/dark.png"
    };

    const emoji = emojis[brainType] || "🧠";
// ✨ Define descriptions and icons for each brainType
    const desc = descriptions[brainType] || "Your brain type is unique!";
    const icon = badgeIcon[brainType] || "img/ikon.png";

    typeEl.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${icon}" alt="${brainType}" width="50" height="50" style="border-radius:12px;">
        <div class="text-start">
          <strong>${emoji} ${brainType} Mode</strong><br>
          <small style="opacity:0.8; font-size: 0.9rem;">${desc}</small>
        </div>
      </div>
    `;
  }

// 📊 Update the XP progress bar
  if (typeof updateXPBar === "function") updateXPBar();

  const note = localStorage.getItem("dailyNote") || "";
// 📝 Load and save the daily note input
  document.getElementById("daily-note").value = note;
// 📝 Load and save the daily note input
  document.getElementById("daily-note").addEventListener("input", (e) => {
    localStorage.setItem("dailyNote", e.target.value);
  });




  // === FAVORITE HACKS ===
// ❤️ Load saved favorite hacks from localStorage
  const favHackList = JSON.parse(localStorage.getItem("savedHacks") || "[]");
  const favHackContainer = document.getElementById("fav-hacks");

// 🌐 Fetch all hacks data from JSON file
  const res = await fetch("hacks.json");
  const data = await res.json();

  data.forEach(category => {
    category.hacks.forEach(hack => {
      if (favHackList.includes(hack.title)) {
        const el = document.createElement("div");
        el.className = "fav-hack-card";
        el.style.backgroundColor = category.style?.card || "#fffaf0";

        el.innerHTML = `
          <div class="info">
            <img src="${category.icon}" alt="${category.name}">
            <span>${hack.title}</span>
          </div>
          <button class="unsave-hack" data-title="${hack.title}" title="Fjern favorit">
          <img src="img/heart2.png" class="fav-heart" alt="Unsave">
          </button>
        `;

        el.addEventListener("click", (e) => {
          if (!e.target.classList.contains("unsave-hack")) {
            window.location.href = `hack.html?id=${category.id}#${encodeURIComponent(hack.title)}`;
          }
        });

        const btn = el.querySelector(".unsave-hack");
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const title = btn.dataset.title;
          const current = JSON.parse(localStorage.getItem("savedHacks") || "[]");

          if (btn.classList.contains("unsaved")) {
            btn.classList.remove("unsaved");
            btn.querySelector("img").src = "img/heart2.png";
            if (!current.includes(title)) current.push(title);
            localStorage.setItem("savedHacks", JSON.stringify(current));
          } else {
            btn.classList.add("unsaved");
            btn.querySelector("img").src = "img/heart3.png";
            const updated = current.filter(t => t !== title);
            localStorage.setItem("savedHacks", JSON.stringify(updated));
          }
        });

// 📌 Append the favorite hack card to the DOM
        favHackContainer.appendChild(el);
  if (favHackList.length === 0) {
    const empty = document.createElement("div");
    empty.innerHTML = "<p style='opacity: 0.6; font-style: italic;'>❤️ Your favorite hacks will show up here when you heart one!</p>";
    favHackContainer.appendChild(empty);
  }

      }
    });
  });

  
// === ACHIEVEMENTS SLIDER (Using earlier Tool-layout) ===
// 🏅 Load earned badges from localStorage
const badgeList = JSON.parse(localStorage.getItem("badges") || "[]");
const pageWrapper = document.getElementById("badge-pages");
const dotContainer = document.getElementById("badge-dots");
let currentPage = 0;
const badgesPerPage = 5;
const pages = [];

badgeList.forEach((badge, index) => {
  if (index % badgesPerPage === 0) {
    const page = document.createElement("div");
    page.className = "tool-page";
    pages.push(page);
    pageWrapper.appendChild(page);
  }

  const el = document.createElement("div");
  el.className = "tool-icon";
  el.setAttribute("data-title", badge.title);
  el.innerHTML = `<img src="${badge.icon}" alt="${badge.title}">`;
  pages[pages.length - 1].appendChild(el);
});

if (badgeList.length === 0) {
  const empty = document.createElement("div");
  empty.innerHTML = "<p style='opacity: 0.6; font-style: italic;'>🏅 Earn badges by using tools and completing hacks!</p>";
  pageWrapper.appendChild(empty);
}

// 📍 Navigation dots (The dots for scrolling like on an app)
dotContainer.innerHTML = "";
if (pages.length > 1) {
  dotContainer.style.display = "block";
  pages.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showPage(i));
    dotContainer.appendChild(dot);
  });
} else {
  dotContainer.style.display = "none";
}

// 📜 Switch to the selected badge page using transform + update active dot
function showPage(index) {
  const offset = -index * 100;
  pageWrapper.style.transform = `translateX(${offset}%)`;
  currentPage = index;
  [...dotContainer.children].forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

// 👆 Enable swipe & drag to navigate between badge pages
let startX = 0;
let isDown = false;
let mouseDown = false;
let mouseStartX = 0;

pageWrapper.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDown = true;
});

pageWrapper.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  const diff = e.touches[0].clientX - startX;
  if (Math.abs(diff) > 50) {
    if (diff < 0 && currentPage < pages.length - 1) {
      showPage(currentPage + 1);
    } else if (diff > 0 && currentPage > 0) {
      showPage(currentPage - 1);
    }
    isDown = false;
  }
});

pageWrapper.addEventListener("touchend", () => isDown = false);

pageWrapper.addEventListener("mousedown", (e) => {
  mouseDown = true;
  mouseStartX = e.clientX;
});

pageWrapper.addEventListener("mousemove", (e) => {
  if (!mouseDown) return;
  const diff = e.clientX - mouseStartX;
  if (Math.abs(diff) > 50) {
    if (diff < 0 && currentPage < pages.length - 1) {
      showPage(currentPage + 1);
    } else if (diff > 0 && currentPage > 0) {
      showPage(currentPage - 1);
    }
    mouseDown = false;
  }
});

pageWrapper.addEventListener("mouseup", () => mouseDown = false);
pageWrapper.addEventListener("mouseleave", () => mouseDown = false);



  // === XP JOURNAL ===
// 📓 Load XP logs and reverse them to show most recent first
  const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]").reverse();
  const journal = document.getElementById("xp-journal-content");

  if (journal && logs.length > 0) {
    logs.forEach(log => {
      const entry = document.createElement("div");
      entry.className = "log-entry";
      entry.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #666;">
          <span>${log.date}</span>
          <span>+${log.xp} XP</span>
        </div>
        <div style="margin-top: 0.3rem; font-size: 0.95rem;">
          <strong>${log.displayName}</strong> used <em>${log.hackTitle}</em>
          ${log.note ? `<div><strong>Note:</strong> ${log.note}</div>` : ""}
        </div>
        <hr style="margin: 0.8rem 0; opacity: 0.4;">
      `;
      journal.appendChild(entry);
  if (logs.length === 0 && journal) {
    const empty = document.createElement("div");
    empty.innerHTML = "<p style='opacity: 0.6; font-style: italic;'>📓 Your activity log will appear here when you complete a hack or use a tool!</p>";
    journal.appendChild(empty);
  }

    });
  }




// === STATISTICS ===
// 📈 Update profile statistics: saved hacks, tools used, last activity
const statHacks = document.getElementById("stat-hacks");
const statTools = document.getElementById("stat-tools");
const statLast = document.getElementById("stat-last");

if (statHacks && statTools && statLast) {
  const savedHacks = JSON.parse(localStorage.getItem("savedHacks") || "[]");
  const logs = JSON.parse(localStorage.getItem("xpLogs") || []);

  // 1. Number of saved hacks
  statHacks.textContent = savedHacks.length;

  // 2. Number of unique tools used
  const toolLogs = logs.filter(log => log.displayName.startsWith("Tool "));
  const uniqueTools = [...new Set(toolLogs.map(log => log.hackTitle))];
  statTools.textContent = uniqueTools.length;

  // 3. Last activity date
  if (logs.length > 0) {
    const lastDate = logs[logs.length - 1].date;
    statLast.textContent = lastDate;
  } else {
    statLast.textContent = "No activity yet";
  }
}



// === ADVANCED STATS ===
// 📊 Show advanced stats: today's completed hacks, top XP day, and weekly average
const statToday = document.getElementById("stat-today");
const statTop = document.getElementById("stat-top");
const statAvg = document.getElementById("stat-avg");

if (statToday && statTop && statAvg) {
  const logs = JSON.parse(localStorage.getItem("xpLogs") || []);
  const todayStr = new Date().toLocaleDateString("da-DK");

  // ✅ Count how many non-tool hacks were completed today
  const todayHacks = logs.filter(log =>
    log.date === todayStr && !log.displayName.startsWith("Tool ")
  );
  statToday.textContent = todayHacks.length;

  // 🥇 Find the single day with the highest XP total
  const xpByDate = {};
  logs.forEach(log => {
    xpByDate[log.date] = (xpByDate[log.date] || 0) + log.xp;
  });

  let maxXP = 0;
  let maxDate = "";
  for (const date in xpByDate) {
    if (xpByDate[date] > maxXP) {
      maxXP = xpByDate[date];
      maxDate = date;
    }
  }
  statTop.textContent = `${maxXP} XP den ${maxDate}`;

  // 📅 Calculate average XP across the last 7 days
  const today = new Date();
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString("da-DK");
  });

  let total = 0;
  last7.forEach(date => {
    total += xpByDate[date] || 0;
  });
  const avg = (total / 7).toFixed(2);
  statAvg.textContent = `${avg} XP`;
}



  // === Reset ===
// 🔄 Reset profile: clear localStorage and reload page
  document.getElementById("reset-profile").addEventListener("click", () => {
    if (confirm("Do you wish to reset your profile and delete all your data?")) {
      localStorage.clear();
      location.reload();
    }
  });
});

// 🖼️ Load and display saved avatar
const savedAvatar = localStorage.getItem("avatar");
if (savedAvatar) {
  document.querySelector(".avatar-img").src = savedAvatar;
}

// 🧑‍🎨 Allow user to pick a new avatar from modal
document.querySelectorAll(".select-avatar").forEach(img => {
  img.addEventListener("click", () => {
    const chosenAvatar = img.dataset.avatar;
    localStorage.setItem("avatar", chosenAvatar);
    document.querySelector(".avatar-img").src = chosenAvatar;
    setTimeout(() => {
      location.reload();
    }, 300);

    const modal = bootstrap.Modal.getInstance(document.getElementById("editAvatarModal"));
    modal.hide();
  });
});
