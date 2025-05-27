// === frontpage.js ===
// This script runs once the front page DOM is fully loaded.
// It handles scroll-based animations and XP progress bar updates.

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Scroll animation on category cards:
  // Adds a "fade-up-visible" class when a category card comes into view.
  const cards = document.querySelectorAll('.category-card');
  if (cards.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-up-visible");
          observer.unobserve(entry.target); // Only trigger once per element
        }
      });
    }, { threshold: 0.1 }); // Triggers when 10% of card is visible

    cards.forEach(card => observer.observe(card));
  }

  // 🧠 Update XP bar on frontpage:
  // This checks if updateXPBar exists and runs it to reflect the latest XP level
  if (typeof updateXPBar === "function") updateXPBar();
});
