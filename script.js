"use strict";

// --- GLOBAL STATE ---
const lessons = [
    {
        title: "Lesson 1: Solving Equations",
        content: "Example: 2x + 4 = 10\n\nStep 1: Subtract 4 → 2x = 6\nStep 2: Divide by 2 → x = 3"
    },
    {
        title: "Lesson 2: Distributive Property",
        content: "Example: 3(x + 2)\n\nMultiply: 3·x + 3·2 = 3x + 6"
    },
    {
        title: "Lesson 3: Combining Like Terms",
        content: "Example: 2x + 5 + 3x\n\nCombine: 5x + 5"
    }
];

let currentLesson = 0;
const totalLessons = lessons.length; // Defined here so updateProgress works!

// --- PROGRESS BAR LOGIC ---
function updateProgress() {
    // Progress calculation (1 of 3 = 33%, 2 of 3 = 66%, etc.)
    const percent = Math.floor(((currentLesson + 1) / totalLessons) * 100);

    const fill = document.getElementById("progress-fill");
    const text = document.getElementById("progress-text");

    if (fill && text) {
        fill.style.width = percent + "%";
        text.innerText = percent + "% of course completed";
    }
}

// --- LESSON MODAL FUNCTIONS ---
function openLesson() {
    currentLesson = 0;
    loadLesson();
    document.getElementById("lesson-box").style.display = "block";
    updateProgress(); // Initialize bar when opening
}

function loadLesson() {
    document.getElementById("lesson-title").innerText = lessons[currentLesson].title;
    document.getElementById("lesson-content").innerText = lessons[currentLesson].content;
}

function nextLesson() {
    if (currentLesson < lessons.length - 1) {
        currentLesson++;
        loadLesson();
        updateProgress(); // Updates bar as they click through
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
}

// --- VIDEO FUNCTIONS ---
function openVideo() {
    document.getElementById("video-box").style.display = "block";
}

function closeVideo() {
    document.getElementById("video-box").style.display = "none";
}

function loadVideo(videoId) {
    document.getElementById("video-frame").src = "https://www.youtube.com/embed/" + videoId;
}

// --- QUIZ LOGIC ---
const quizData = [
    { question: "What is 2x + 4 = 10?", options: ["x = 2", "x = 3", "x = 4", "x = 5"], correct: 1 },
    { question: "Solve: 5x - 15 = 10", options: ["x = 3", "x = 5", "x = 6", "x = 10"], correct: 2 },
    { question: "Simplify: 3(x + 2) = ?", options: ["3x + 2", "3x + 6", "x + 6", "3x + 4"], correct: 1 }
];

let currentQuestion = 0;

function showQuiz() {
    currentQuestion = 0;
    loadQuestion();
    document.getElementById("quiz-box").style.display = "block";
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    document.getElementById("quiz-question").innerText = q.question;
    const buttons = document.querySelectorAll(".quiz-options button");
    buttons.forEach((btn, index) => {
        btn.innerText = q.options[index];
        btn.onclick = () => checkAnswer(index);
    });
    document.getElementById("quiz-result").innerText = "";
}

function checkAnswer(selected) {
    const q = quizData[currentQuestion];
    const result = document.getElementById("quiz-result");
    if (selected === q.correct) {
        result.innerText = "✅ Correct!";
    } else {
        result.innerText = "❌ Try again!";
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= quizData.length) {
        document.getElementById("quiz-question").innerText = "🎉 Quiz Finished!";
        document.querySelector(".quiz-options").innerHTML = "";
    } else {
        loadQuestion();
    }
}

function closeQuiz() {
    document.getElementById("quiz-box").style.display = "none";
}

// --- FILE DOWNLOAD ---
function downloadWorksheet() {
    const link = document.createElement("a");
    link.href = "worksheet.pdf"; 
    link.download = "SolveSpace_Worksheet.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- SCROLL REVEAL ---
function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(section => {
        const windowHeight = window.innerHeight;
        const elementTop = section.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            section.classList.add("active");
        }
    });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// --- CALENDAR LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");
    const sessionInfo = document.getElementById("sessionInfo");
    if (!calendar || !monthYear) return;

    let date = new Date();
    const sessions = {
        "2026-01-10": "Algebra Tutoring | 3:00–4:00 PM",
        "2026-01-12": "Geometry Study Group | 4:00–5:00 PM",
        "2026-01-15": "Pre-Calculus Help | 2:30–3:30 PM"
    };

    // Move these outside of the DOMContentLoaded listener
function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById("theme-toggle");
    
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        btn.innerText = "☀️ Light Mode";
    } else {
        btn.innerText = "🌙 Dark Mode";
    }
}

function filterResources() {
    let input = document.getElementById('resourceSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.resource-card');
    
    cards.forEach(card => {
        let title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? "block" : "none";
    });
}

function filterResources() {
    let input = document.getElementById('resourceSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.resource-card');
    
    cards.forEach(card => {
        let title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? "block" : "none";
    });
}

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
                    : `<p>No tutoring sessions scheduled.</p>`;
            });
            calendar.appendChild(dayEl);
        }
    }

    document.getElementById("prevMonth").addEventListener("click", () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
    document.getElementById("nextMonth").addEventListener("click", () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });
    renderCalendar();
});