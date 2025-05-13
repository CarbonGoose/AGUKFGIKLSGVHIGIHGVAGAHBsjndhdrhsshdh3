document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.category-card');
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-up-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    cards.forEach(card => observer.observe(card));
  });
  