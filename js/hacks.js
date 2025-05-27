// hacks.js

// === LOAD & RENDER CATEGORY PAGE ===
// Loads the selected category from URL, applies styles, generates hack cards,
// updates progress bar, and manages badge system.
async function loadHackPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const res = await fetch("hacks.json");
  const data = await res.json();
  const category = data.find((c) => c.id === id);

  if (!category) {


  // === Dynamic SEO updates ===
  document.title = `${category.name} – Productivity Hacks`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", category.description);
  } else {
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = category.description;
    document.head.appendChild(meta);
  }

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
const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
const categoryPrefix = category.name.split(" ")[0]; // fx "Sunshine"
const completed = category.hacks.filter(h =>
  logs.some(log => log.hackTitle === h.title && log.displayName.startsWith(categoryPrefix))
).length;
document.querySelector(".progress-fill").style.height = `${(completed / total) * 100}%`;
document.getElementById("progress-text").textContent = `${completed} / ${total} hacks`;



// === HACK BADGE SYSTEM ===
if (completed === total) {
  const badges = JSON.parse(localStorage.getItem("badges") || "[]");
  const badgeId = `badge-${category.id}`;
  const alreadyEarned = badges.some(b => b.id === badgeId);

  if (!alreadyEarned) {
    const newBadge = {
      id: badgeId,
      category: category.name,
      earnedOn: new Date().toLocaleDateString("da-DK"),
      title: `Completed all ${category.name}`,
      icon: category.icon
    };
    badges.push(newBadge);
    localStorage.setItem("badges", JSON.stringify(badges));
    alert(`🏅 New Badge Unlocked: ${newBadge.title}`);
  }
}
//SAVE FAVORITE HACK
  const saveKey = "savedHacks";
  const savedHackTitles = JSON.parse(localStorage.getItem(saveKey)) || [];

  
function wasUsedToday(hackTitle) {
  const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
  const today = new Date().toLocaleDateString("da-DK");
  return logs.some(log => log.hackTitle === hackTitle && log.date === today);
}


  // === GENERATE HACK CARDS ===

  category.hacks.forEach((hack) => {
    const el = document.createElement("section");
    el.className = "hack-card";

    const howto = hack.howto
      ? `<div class=\"hack-howto\"><strong>How to:</strong><div class="howto-text">${hack.howto.replace(/\n/g, '<br>')}</div>
</div>`
      : "";

    const extraContent = window.generateExtraContent(hack.extra);

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
        <button class=\"done-btn\"> I did it! ✅ </button>
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

    
    // === VIDEO HEIGHT MATCHING ===
// Ensures video and left content block are visually aligned on larger screens

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

    
    // === HANDLE CARD EXPAND TOGGLE ===
// Expands or collapses extra content when card is clicked

    el.addEventListener("click", (e) => {
      const isInteractive = ["textarea", "button", "input", "a", "label", "img"].includes(e.target.tagName.toLowerCase()) ||
        e.target.classList.contains("save-tag") ||
        e.target.closest(".video-wrapper") ||
        e.target.closest(".hack-howto") ||
        e.target.closest(".checklist");
      if (isInteractive) return;

      //Click on hack card opens/closes extra content (avoid click on interactive elements).
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


    //SAVE (HEART) SYSTEM
    const saveButton = el.querySelector(".save-tag");

    if (savedHackTitles.includes(hack.title)) {
      saveButton.dataset.state = "saved";
      saveButton.innerHTML = `<img src=\"img/heart2.png\" alt=\"Gemt\" class=\"heart-icon\">`;
    }
    
    // 2) Click on ❤️-icon, saves/removes hack as favorite in localStorage.
    saveButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isSaved = saveButton.dataset.state === "saved";

      let updatedTitles = JSON.parse(localStorage.getItem(saveKey)) || [];


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


    // === XP POPUP BUTTON ===
    const doneBtn = el.querySelector(".done-btn");
    doneBtn.addEventListener("click", () => {
      showNotePopup(hack, category); // Viser popup, sender hack + kategori-objekt
    });




    
    // === HANDLE CHECKLIST ===
 if (hack.extra && hack.extra.type === "checklist") {
  const checklist = el.querySelector(".checklist");
  if (checklist) renderChecklist(checklist);
}

// === INIT POMODORO TOOL ===
if (hack.extra && hack.extra.type === "tool" && hack.extra.toolId === "pomodoro") {
  const pomodoro = el.querySelector(".pomodoro-container");
  if (pomodoro) initPomodoro();
}

  });
}




// === XP NOTE POPUP ===
// Shows popup to enter thoughts and confirm completion when user clicks "I did it!" 

function showNotePopup(hack, category) {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
    <div class="popup-box">
      <button class="close-popup" title="Luk">✖</button>
      <p>How did it go? What are your thoughts?</p>
      <textarea placeholder="Write your thoughts..."></textarea>
      <div class="popup-actions">
        <button class="confirm-note btn btn-success">✅</button>
        <button class="skip-note btn btn-secondary">Skip</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Luk popup hvis X trykkes
  popup.querySelector(".close-popup").addEventListener("click", () => popup.remove());

  // Event listeners til knapperne
  popup.querySelector(".confirm-note").addEventListener("click", () => handleXPConfirm(hack, category.name ));
  popup.querySelector(".skip-note").addEventListener("click", () => handleXPConfirm(hack, category.name, true));
}


// === HANDLE XP LOGGING ===
// Saves log entry with XP, username, date and optional note into localStorage

function handleXPConfirm(hack, categoryName, skip = false) {
  const popup = document.querySelector(".popup-overlay");
  const note = skip ? "" : (popup.querySelector("textarea").value.trim());
  const username = localStorage.getItem("username") || "User";
  const shortCategory = categoryName.split(" ")[0]; // fx "Chaos Goblin" → "Chaos"

  const xpValue = hack.xp || 5;

  const logEntry = {
    date: new Date().toLocaleDateString("da-DK"),
    displayName: `${shortCategory} ${username}`,
    hackTitle: hack.title,
    note: note,
    xp: xpValue
  };

  
  const logs = JSON.parse(localStorage.getItem("xpLogs") || "[]");
  logs.push(logEntry);
  localStorage.setItem("xpLogs", JSON.stringify(logs));

  // Bonus: Gem XP
  let currentXP = parseInt(localStorage.getItem("xp") || "0");
  localStorage.setItem("xp", currentXP + xpValue);

  popup.remove();
  showConfetti(); // findes allerede!
}





// === APPLY CATEGORY STYLING ===
// Reads styling from category JSON and sets CSS variables accordingly

// === APPLY CATEGORY STYLING ===

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
  root.style.setProperty("--howtoBg", style.howtoBg);
  root.style.setProperty("--howtoText", style.howtoText);
  root.style.setProperty("--progressBg", style.progressBg);
  root.style.setProperty("--saveTag", style.saveTag); //Not sure what this does anymore
  
  if (style.backgroundImage) {
  document.documentElement.style.setProperty('--backgroundImage', style.backgroundImage);
}

// === OPDATES PROFILE PICTURE IN HACK HEADER ===
const avatar = localStorage.getItem("avatar") || "img/ikon.png";
const profileBadge = document.querySelector(".profile-badge img");
if (profileBadge) profileBadge.src = avatar;


// === AUTO OPEN HACK FROM HASH (Like when you open the hack from Profile) ===
// If URL has a #title (e.g. #Fake Deadline), find the matching hack,
setTimeout(() => {
  const hashTitle = decodeURIComponent(window.location.hash.substring(1));
  if (!hashTitle) return;

  const allHacks = document.querySelectorAll(".hack-card");
  const target = [...allHacks].find(card =>
    card.querySelector("h2")?.textContent === hashTitle
  );

// open the hack, scroll to it, and expand video (if on desktop).
  if (target) {
    const extra = target.querySelector(".hack-extra");
    const videoWrapper = target.querySelector(".video-wrapper");
    const leftContent = target.querySelector(".left");

    extra?.classList.add("open");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, null, ' ');

    const isMobile = window.innerWidth < 768;
    if (videoWrapper && leftContent) {
      if (!isMobile) {
        videoWrapper.classList.remove("collapsed");
        videoWrapper.style.maxHeight = leftContent.offsetHeight + "px";
      } else {
        videoWrapper.style.maxHeight = "none";
      }
    }
  }
}, 300);
}

// Initialize page load
document.addEventListener("DOMContentLoaded", loadHackPage);
