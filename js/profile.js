// profile.js

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username") || "Brugernavn";
    document.getElementById("profile-username").textContent = username;
  
    // Load XP and level (dummy)
    document.getElementById("xp-bar").style.width = "40%";
    document.getElementById("xp-bar").textContent = "1200 / 3000 XP";
    document.getElementById("user-level").textContent = "6";
  
    // Load saved daily note
    const note = localStorage.getItem("dailyNote") || "";
    document.getElementById("daily-note").value = note;
  
    // Save note on change
    document.getElementById("daily-note").addEventListener("input", (e) => {
      localStorage.setItem("dailyNote", e.target.value);
    });
  
    // Reset profile
    document.getElementById("reset-profile").addEventListener("click", () => {
      if (confirm("Er du sikker på, at du vil nulstille din profil?")) {
        localStorage.clear();
        location.reload();
      }
    });
  });

  
  document.querySelectorAll(".select-avatar").forEach(img => {
    img.addEventListener("click", () => {
      const chosenAvatar = img.dataset.avatar;
      localStorage.setItem("avatar", chosenAvatar);
      document.querySelector(".avatar-img").src = chosenAvatar;
      setTimeout(() => {
        location.reload(); // genindlæser så navbar også opdateres
      }, 300);
      
  
      const modal = bootstrap.Modal.getInstance(document.getElementById("editAvatarModal"));
      modal.hide();
    });
  });

  const savedAvatar = localStorage.getItem("avatar");
if (savedAvatar) {
  document.querySelector(".avatar-img").src = savedAvatar;
}


