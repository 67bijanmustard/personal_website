"use strict";

// ─── DARK MODE ───────────────────────────────────────────────
function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    btn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").textContent = "☀️ Light Mode";
  }
});

// ─── MOBILE NAV ──────────────────────────────────────────────
function toggleNav() {
  document.getElementById("nav-menu").classList.toggle("open");
}

// ─── RESOURCE SEARCH ─────────────────────────────────────────
// Defined at top level so onkeyup="filterResources()" in HTML can find it
function filterResources() {
  const input = document.getElementById("resourceSearch").value.toLowerCase();
  document.querySelectorAll(".resource-card").forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(input) ? "" : "none";
  });
}

// ─── GLOBAL STATE ────────────────────────────────────────────
const lessons = [
  {
    title: "Lesson 1: Solving Equations",
    content: "Example: 2x + 4 = 10\n\nStep 1: Subtract 4 from both sides → 2x = 6\nStep 2: Divide both sides by 2 → x = 3 ✅"
  },
  {
    title: "Lesson 2: Distributive Property",
    content: "Example: 3(x + 2)\n\nMultiply each term inside: 3·x + 3·2 = 3x + 6 ✅"
  },
  {
    title: "Lesson 3: Combining Like Terms",
    content: "Example: 2x + 5 + 3x\n\nGroup like terms: (2x + 3x) + 5 = 5x + 5 ✅"
  }
];

let currentLesson = 0;
const totalLessons = lessons.length;

// ─── PROGRESS BAR ────────────────────────────────────────────
function updateProgress() {
  const percent = Math.floor(((currentLesson + 1) / totalLessons) * 100);
  const fill = document.getElementById("progress-fill");
  const text = document.getElementById("progress-text");
  if (fill && text) {
    fill.style.width = percent + "%";
    text.textContent = percent + "% of course completed";
  }
}

// ─── LESSON MODAL ────────────────────────────────────────────
function openLesson() {
  currentLesson = 0;
  loadLesson();
  document.getElementById("lesson-box").style.display = "block";
  updateProgress();
}

function loadLesson() {
  document.getElementById("lesson-title").textContent = lessons[currentLesson].title;
  document.getElementById("lesson-content").textContent = lessons[currentLesson].content;
}

function nextLesson() {
  if (currentLesson < lessons.length - 1) {
    currentLesson++;
    loadLesson();
    updateProgress();
  }
}

function prevLesson() {
  if (currentLesson > 0) {
    currentLesson--;
    loadLesson();
    updateProgress();
  }
}

function closeLesson() {
  document.getElementById("lesson-box").style.display = "none";
  markCompleted("Algebra Lessons");
}

// ─── VIDEO MODAL ─────────────────────────────────────────────
function openVideo() {
  document.getElementById("video-box").style.display = "block";
}
function closeVideo() {
  document.getElementById("video-box").style.display = "none";
}
function loadVideo(videoId) {
  document.getElementById("video-frame").src = "https://www.youtube.com/embed/" + videoId;
}

// ─── QUIZ ────────────────────────────────────────────────────
const quizData = [
  { question: "Solve for x:  2x + 4 = 10", options: ["x = 2", "x = 3", "x = 4", "x = 5"], correct: 1 },
  { question: "Solve for x:  5x − 15 = 10", options: ["x = 3", "x = 5", "x = 6", "x = 10"], correct: 1 },
  { question: "Simplify:  3(x + 2)", options: ["3x + 2", "3x + 6", "x + 6", "3x + 4"], correct: 1 },
  { question: "Combine like terms:  4x + 2 + 3x − 1", options: ["7x + 1", "7x + 3", "x + 1", "7x − 1"], correct: 0 },
  { question: "Solve for x:  x/4 = 3", options: ["x = 7", "x = 12", "x = 3", "x = 0.75"], correct: 1 }
];

let currentQuestion = 0;
let quizScore = 0;
let answeredThisQuestion = false;

function showQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  loadQuestion();
  document.getElementById("quiz-box").style.display = "block";
}

function loadQuestion() {
  answeredThisQuestion = false;
  const q = quizData[currentQuestion];

  // Show question with number
  document.getElementById("quiz-question").textContent =
    `Q${currentQuestion + 1}/${quizData.length}: ${q.question}`;

  const buttons = document.querySelectorAll(".quiz-options button");
  buttons.forEach((btn, i) => {
    btn.textContent = q.options[i];
    btn.disabled = false;
    btn.style.background = "";
    btn.style.color = "";
    btn.onclick = () => checkAnswer(i);
  });

  document.getElementById("quiz-result").textContent = "";

  // Update score display
  updateScoreDisplay();
}

function checkAnswer(selected) {
  if (answeredThisQuestion) return; // prevent double-clicking
  answeredThisQuestion = true;

  const q = quizData[currentQuestion];
  const buttons = document.querySelectorAll(".quiz-options button");
  const isCorrect = selected === q.correct;

  if (isCorrect) quizScore++;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.style.background = "#22c55e";
      btn.style.color = "white";
    } else if (i === selected && !isCorrect) {
      btn.style.background = "#ef4444";
      btn.style.color = "white";
    }
  });

  document.getElementById("quiz-result").textContent = isCorrect ? "✅ Correct!" : `❌ The answer was: ${q.options[q.correct]}`;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const scoreEl = document.getElementById("quiz-score-display");
  if (scoreEl) {
    scoreEl.textContent = `Score: ${quizScore}/${currentQuestion + (answeredThisQuestion ? 1 : 0)}`;
  }
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= quizData.length) {
    showQuizResults();
  } else {
    loadQuestion();
  }
}

function showQuizResults() {
  const pct = Math.round((quizScore / quizData.length) * 100);
  let emoji = "🌟";
  let msg = "Excellent work!";
  if (pct < 60) { emoji = "📚"; msg = "Keep practicing — you've got this!"; }
  else if (pct < 80) { emoji = "👍"; msg = "Good effort! Review the ones you missed."; }

  document.getElementById("quiz-question").textContent = `${emoji} Quiz Complete!`;
  document.querySelector(".quiz-options").innerHTML = `
    <div style="text-align:center; padding: 12px 0;">
      <div style="font-size:2.5rem; margin-bottom:6px;">${pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}</div>
      <div style="font-size:1.6rem; font-weight:700; color:white; margin-bottom:4px;">${quizScore} / ${quizData.length}</div>
      <div style="font-size:1rem; color:rgba(255,255,255,0.7); margin-bottom:4px;">${pct}% correct</div>
      <div style="font-size:0.85rem; color:rgba(255,255,255,0.6);">${msg}</div>
    </div>
  `;
  document.getElementById("quiz-result").textContent = "";
  if (document.getElementById("quiz-score-display")) {
    document.getElementById("quiz-score-display").textContent = `Final Score: ${quizScore}/${quizData.length}`;
  }

  // Save best score to localStorage
  const prev = parseInt(localStorage.getItem("quiz-best") || "0");
  if (quizScore > prev) localStorage.setItem("quiz-best", quizScore);

  if (quizScore >= 4) markCompleted("Practice Quiz");
}

function closeQuiz() {
  document.getElementById("quiz-box").style.display = "none";
}

// ─── COMPLETED ACTIVITIES ────────────────────────────────────
function markCompleted(activity) {
  let completed = JSON.parse(localStorage.getItem("completed") || "[]");
  if (!completed.includes(activity)) {
    completed.push(activity);
    localStorage.setItem("completed", JSON.stringify(completed));
    renderCompleted();
  }
}

function renderCompleted() {
  const list = document.getElementById("completed-list");
  if (!list) return;
  const completed = JSON.parse(localStorage.getItem("completed") || "[]");
  if (completed.length === 0) {
    list.innerHTML = "<li>No activities completed yet.</li>";
  } else {
    list.innerHTML = completed.map(item => `<li>✅ ${item}</li>`).join("");
  }
}

// ─── WORKSHEET DOWNLOAD ──────────────────────────────────────
function downloadWorksheet() {
  alert("📄 Worksheet coming soon! Check back before your next session.");
}

// ─── SCROLL REVEAL ───────────────────────────────────────────
function revealOnScroll() {
  document.querySelectorAll(".reveal").forEach(section => {
    if (section.getBoundingClientRect().top < window.innerHeight - 100) {
      section.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ─── CALENDAR ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCompleted();

  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  const sessionInfo = document.getElementById("sessionInfo");
  if (!calendar || !monthYear) return;

  let date = new Date();

  // Build session dates in the CURRENT month so they're always visible
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");

  function makeDate(day) {
    return `${y}-${m}-${String(day).padStart(2, "0")}`;
  }

  const sessions = {
    [makeDate(19)]: "Algebra Tutoring | 3:00–4:00 PM",
    [makeDate(21)]: "Geometry Study Group | 4:00–5:00 PM",
    [makeDate(26)]: "Pre-Calculus Help | 2:30–3:30 PM"
  };

  function renderCalendar() {
    calendar.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) calendar.appendChild(document.createElement("div"));

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement("div");
      dayEl.textContent = day;
      const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (sessions[fullDate]) dayEl.classList.add("has-session");
      dayEl.addEventListener("click", () => {
        sessionInfo.innerHTML = sessions[fullDate]
          ? `<h3>Session Details</h3><p>${sessions[fullDate]}</p>`
          : `<p>No tutoring sessions scheduled for this day.</p>`;
      });
      calendar.appendChild(dayEl);
    }
  }

  document.getElementById("prevMonth").addEventListener("click", () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
  document.getElementById("nextMonth").addEventListener("click", () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });
  renderCalendar();
});