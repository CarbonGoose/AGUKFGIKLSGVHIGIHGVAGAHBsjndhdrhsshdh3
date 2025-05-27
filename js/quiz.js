// quiz.js

// 📋 Question and answer data for the personality quiz
const quizData = [
  {
    question: "How are you feeling today?",
    options: [
      { text: "😴 Tired and heavy", category: "Gentle" },
      { text: "😤 Ready to push myself", category: "Discipline" },
      { text: "😎 Just want to have some fun", category: "Chaos" },
      { text: "☀️ Feeling positive and upbeat", category: "Sunshine" },
      { text: "📜 Could go for a quest", category: "Gamified" },
      { text: "👁️ In a reflective and mindful mood", category: "Meta" },
      { text: "👑 Want simple and effective tricks", category: "Classic" },
      { text: "💀 In a mood for an existensial crisis", category: "Dark" },
    ]
  },
  {
    question: "What sounds most appealing right now?",
    options: [
      { text: "💌 A gentle push and kind words", category: "Gentle" },
      { text: "📋 Structure and discipline", category: "Discipline" },
      { text: "🎲 Spontaneous chaos and creativity", category: "Chaos" },
      { text: "🌈 Vibes, colors, and comfort", category: "Sunshine" },
      { text: "🎮 Turning life into a game", category: "Gamified" },
      { text: "📖 Writing, breathing, reflecting", category: "Meta" },
      { text: "🧠 Old-school productivity tricks", category: "Classic" },
      { text: "🕯️ Some deep, dark honesty", category: "Dark" },
    ]
  },
  {
    question: "What would help you most right now?",
    options: [
      { text: "A soft, safe space", category: "Gentle" },
      { text: "A hard plan and strong routine", category: "Discipline" },
      { text: "Freedom and randomness", category: "Chaos" },
      { text: "Dopamine and joy", category: "Sunshine" },
      { text: "Feeling like a character on a mission", category: "Gamified" },
      { text: "Remembering why you do this for yourself", category: "Meta" },
      { text: "A simple trick that just works", category: "Classic" },
      { text: "Mortality-fueled meaning and drive", category: "Dark" },
    ]
  },
  {
    question: "How would a friend describe you today?",
    options: [
      { text: "🧸 Soft and sensitive", category: "Gentle" },
      { text: "💼 Focused and goal-oriented", category: "Discipline" },
      { text: "🌀 Creative and a bit all over", category: "Chaos" },
      { text: "🌞 Energetic and optimistic", category: "Sunshine" },
      { text: "🕹️ Playful and quirky", category: "Gamified" },
      { text: "🧘 Calm and introspective", category: "Meta" },
      { text: "📎 Practical and efficient", category: "Classic" },
      { text: "🧨 Intense but in a cool way", category: "Dark" },
    ]
  },
  {
    question: "How do you want to feel after this quiz?",
    options: [
      { text: "Safe and understood", category: "Gentle" },
      { text: "In control and productive", category: "Discipline" },
      { text: "Excited and sparked", category: "Chaos" },
      { text: "Happy and energized", category: "Sunshine" },
      { text: "Like a hero in a game", category: "Gamified" },
      { text: "Grounded in purpose", category: "Meta" },
      { text: "Ready to take one action", category: "Classic" },
      { text: "Like life matters again", category: "Dark" },
    ]
  },
  {
    question: "What usually helps you stay focused?",
    options: [
      { text: "Comfort and encouragement", category: "Gentle" },
      { text: "A clear plan and pressure", category: "Discipline" },
      { text: "Switching between tasks often", category: "Chaos" },
      { text: "A good mood and atmosphere", category: "Sunshine" },
      { text: "Points and rewards", category: "Gamified" },
      { text: "A sense of meaning and why", category: "Meta" },
      { text: "Simple productivity hacks", category: "Classic" },
      { text: "Big questions about life and time", category: "Dark" },
    ]
  },
  {
    question: "What kind of motivation do you respond to?",
    options: [
      { text: "Soft, emotional", category: "Gentle" },
      { text: "Strict and commanding", category: "Discipline" },
      { text: "Funny and chaotic", category: "Chaos" },
      { text: "Positive and cozy", category: "Sunshine" },
      { text: "Gamified and trackable", category: "Gamified" },
      { text: "Purpose-driven", category: "Meta" },
      { text: "Smart and effective", category: "Classic" },
      { text: "Existential and deep", category: "Dark" },
    ]
  },
  {
    question: "What vibe fits your day best?",
    options: [
      { text: "🧸 Gentle and soft", category: "Gentle" },
      { text: "⏰ Discipline and direction", category: "Discipline" },
      { text: "🌪️ Wild and random", category: "Chaos" },
      { text: "🌞 Bright and warm", category: "Sunshine" },
      { text: "🧙 Fantasy quest", category: "Gamified" },
      { text: "🧘 Deep and reflective", category: "Meta" },
      { text: "🧠 Simple and practical", category: "Classic" },
      { text: "⛓️ Deep and dark", category: "Dark" },
    ]
  }
];

// 🔢 Keeps track of which question the user is currently on
let currentQuestion = 0;
// 🧠 Stores how many times each brain type was selected
const scores = {};
const quizContainer = document.getElementById("quiz-container");
const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const progressEl = document.getElementById("quiz-progress");
const progressFill = document.getElementById("quiz-progress-fill");
const resultSection = document.getElementById("quiz-result");
const resultText = document.getElementById("result-category");
// 🧭 'Go to Hacks' button opens the category related to the result
const goToHacks = document.getElementById("go-to-hacks");

// 🎯 Displays the current quiz question and updates progress
function showQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  progressEl.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;

  // 💚 Update progress bar width
  const progressPercent = ((currentQuestion + 1) / quizData.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-success w-75";
    btn.textContent = opt.text;
    btn.onclick = () => {
      scores[opt.category] = (scores[opt.category] || 0) + 1;
      currentQuestion++;
      if (currentQuestion < quizData.length) {
// 🎯 Displays the current quiz question and updates progress
        showQuestion();
      } else {
// 🏁 Called at the end of the quiz to show the result and award XP
        showResult();
      }
    };
    optionsEl.appendChild(btn);
  });
}

// 🏁 Called at the end of the quiz to show the result and award XP
function showResult() {
  quizContainer.classList.add("d-none");
  resultSection.classList.remove("d-none");

  const topCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  // Hent info
const icons = {
  "Gentle": "img/gentle1.png",
  "Discipline": "img/discipline1.png",
  "Chaos": "img/chaos1.png",
  "Sunshine": "img/sunshine.png",
  "Gamified": "img/gamified1.png",
  "Meta": "img/meta12.png",
  "Classic": "img/classic2.png",
  "Dark": "img/dark.png"
};

const ids = {
  "Gentle": "gentle",
  "Discipline": "discipline",
  "Chaos": "chaos",
  "Sunshine": "sunshine",
  "Gamified": "gamified",
  "Meta": "meta",
  "Classic": "classic",
  "Dark": "dark"
};

const icon = icons[topCategory] || "img/ikon.png";
const id = ids[topCategory] || "classic"; // fallback
const encodedTitle = encodeURIComponent(topCategory + " Mode");
const link = `hack.html?id=${id}#${encodedTitle}`;

resultText.innerHTML = `
  <a href="${link}" class="result-wrapper text-decoration-none" style="text-align: center;">
    <div class="result-name fw-bold" style="font-size: 2rem; color: #1b1f40;">${topCategory} Mode</div>
    <img src="${icon}" alt="${topCategory}" class="result-icon" style="width: 70px; margin-top: 1rem;">
  </a>
`;



// 💾 Save the result category to localStorage for later use
  localStorage.setItem("brainType", topCategory);

  if (!localStorage.getItem("quizCompleted")) {
    const username = localStorage.getItem("username") || "User";
// 🎮 Log XP when user completes the quiz for the first time
    window.logXP({
      displayName: `${username}`,
      hackTitle: "User used Brain-Type Quiz for the first time",
      xp: 10
    });
    localStorage.setItem("quizCompleted", "true");
  }

  const existingRetake = document.getElementById("retake-quiz-btn");
  if (existingRetake) existingRetake.remove();

  const retakeBtn = document.createElement("button");
  retakeBtn.id = "retake-quiz-btn";
  retakeBtn.textContent = "🔄 Retake Quiz";
  retakeBtn.className = "btn btn-outline-secondary mt-3";
// 🔁 Allows user to retake the quiz by resetting state
  retakeBtn.onclick = () => {
    localStorage.removeItem("brainType");
// 🔢 Keeps track of which question the user is currently on
    currentQuestion = 0;
    for (let key in scores) delete scores[key];
    quizContainer.classList.remove("d-none");
    resultSection.classList.add("d-none");
// 🎯 Displays the current quiz question and updates progress
    showQuestion();
  };
  resultSection.appendChild(retakeBtn);
}

// 🧭 'Go to Hacks' button opens the category related to the result
goToHacks.addEventListener("click", () => {
  window.location.href = `hack.html?id=${localStorage.getItem("brainType").toLowerCase()}`;
});

// 🚀 Start the quiz when the page has fully loaded
document.addEventListener("DOMContentLoaded", showQuestion);
