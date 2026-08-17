"use strict";

// ─── DARK MODE ───────────────────────────────────────────────
function toggleDarkMode() {
  var body = document.body;
  var btn  = document.getElementById("theme-toggle");
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    btn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("load", function() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = "☀️ Light Mode";
  }
});

// ─── MOBILE NAV ──────────────────────────────────────────────
function toggleNav() {
  document.getElementById("nav-menu").classList.toggle("open");
}

// ─── RESOURCE SEARCH ─────────────────────────────────────────
function filterResources() {
  var input = document.getElementById("resourceSearch").value.toLowerCase();
  document.querySelectorAll(".resource-card").forEach(function(card) {
    var title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(input) ? "" : "none";
  });
}

// ─── PROGRESS BAR ────────────────────────────────────────────
var TOTAL_ACTIVITIES = 4; // Algebra, Geometry, Statistics, Pre-Calculus

function updateProgress() {
  var fill = document.getElementById("progress-fill");
  var text = document.getElementById("progress-text");
  if (!fill || !text) return;
  var completed = JSON.parse(localStorage.getItem("completed") || "[]");
  var pct = Math.min(100, Math.round((completed.length / TOTAL_ACTIVITIES) * 100));
  fill.style.width = pct + "%";
  text.textContent = pct + "% of course completed";
}

// ─── MARK COMPLETED + FIRESTORE SYNC ─────────────────────────
function markCompleted(activity) {
  var completed = JSON.parse(localStorage.getItem("completed") || "[]");
  if (!completed.includes(activity)) {
    completed.push(activity);
    localStorage.setItem("completed", JSON.stringify(completed));

    // Sync to Firestore if user is logged in
    var session = JSON.parse(localStorage.getItem("ss-session") || "{}");
    if (session.uid && typeof db !== "undefined") {
      db.collection("users").doc(session.uid).update({
        completed: firebase.firestore.FieldValue.arrayUnion(activity)
      }).catch(function() {});
    }
  }
  renderCompleted();
}

// ─── RESET PROGRESS ──────────────────────────────────────────
function resetProgress() {
  if (!confirm("Reset all progress? This will clear your completed lessons.")) return;
  localStorage.removeItem("completed");

  var session = JSON.parse(localStorage.getItem("ss-session") || "{}");
  if (session.uid && typeof db !== "undefined") {
    db.collection("users").doc(session.uid).update({ completed: [] }).catch(function() {});
  }

  renderCompleted();
}

// ─── RENDER COMPLETED ─────────────────────────────────────────
function renderCompleted() {
  var list = document.getElementById("completed-list");
  if (!list) return;
  var completed = JSON.parse(localStorage.getItem("completed") || "[]");
  if (completed.length === 0) {
    list.innerHTML = "<li>No activities completed yet.</li>";
  } else {
    list.innerHTML = completed.map(function(item) { return "<li>✅ " + item + "</li>"; }).join("");
  }
  updateProgress();
}

// ─── WORKSHEET DOWNLOAD ──────────────────────────────────────
function downloadWorksheet() {
  markCompleted("Worksheets");
  alert("📄 Worksheet coming soon! Check back before your next session.");
}

// ─── ANNOUNCEMENT ────────────────────────────────────────────
function closeAnnouncement() {
  var bar = document.getElementById("announcement-bar");
  if (bar) bar.style.display = "none";
}

// ─── SCROLL REVEAL ───────────────────────────────────────────
function revealOnScroll() {
  document.querySelectorAll(".reveal").forEach(function(section) {
    if (section.getBoundingClientRect().top < window.innerHeight - 100) {
      section.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ─── CALENDAR ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  renderCompleted();

  var calendar    = document.getElementById("calendar");
  var monthYear   = document.getElementById("monthYear");
  var sessionInfo = document.getElementById("sessionInfo");
  if (!calendar || !monthYear) return;

  var date = new Date();

  // firestoreSessions maps dateKey -> { id, subject, time, tutorName, capacity, enrolled }
  var firestoreSessions = {};

  // Fallback hardcoded sessions (shown while Firestore loads or if offline)
  var today = new Date();
  var y = today.getFullYear();
  var m = String(today.getMonth() + 1).padStart(2, "0");

  function makeDate(day) {
    return y + "-" + m + "-" + String(day).padStart(2, "0");
  }

  var fallbackSessions = {};
  fallbackSessions[makeDate(19)] = { subject: "Algebra Tutoring",        time: "3:00–4:00 PM",  tutorName: "Massimo A.", capacity: 8, enrolled: [] };
  fallbackSessions[makeDate(21)] = { subject: "Geometry Study Group",    time: "4:00–5:00 PM",  tutorName: "Madden G.",  capacity: 10, enrolled: [] };
  fallbackSessions[makeDate(26)] = { subject: "Pre-Calculus Help",       time: "2:30–3:30 PM",  tutorName: "Massimo A.", capacity: 8, enrolled: [] };

  // Load sessions from Firestore and seed fallback if collection is empty
  if (typeof db !== "undefined") {
    db.collection("sessions").get().then(function(snap) {
      if (snap.empty) {
        // Seed initial sessions from fallback data
        var batch = db.batch();
        Object.keys(fallbackSessions).forEach(function(dateKey) {
          var s = fallbackSessions[dateKey];
          var ref = db.collection("sessions").doc();
          batch.set(ref, {
            subject:    s.subject,
            dateStr:    dateKey,
            time:       s.time,
            tutorName:  s.tutorName,
            capacity:   s.capacity,
            enrolled:   [],
            createdAt:  firebase.firestore.FieldValue.serverTimestamp()
          });
        });
        batch.commit().catch(function() {});
        firestoreSessions = fallbackSessions;
        renderCalendar();
      } else {
        snap.docs.forEach(function(doc) {
          var d = doc.data();
          firestoreSessions[d.dateStr] = {
            id:        doc.id,
            subject:   d.subject,
            time:      d.time,
            tutorName: d.tutorName,
            capacity:  d.capacity,
            enrolled:  d.enrolled || []
          };
        });
        renderCalendar();
      }
    }).catch(function() {
      firestoreSessions = fallbackSessions;
      renderCalendar();
    });
  } else {
    firestoreSessions = fallbackSessions;
  }

  function renderCalendar() {
    calendar.innerHTML = "";
    var year  = date.getFullYear();
    var month = date.getMonth();
    monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
    var firstDay    = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    for (var i = 0; i < firstDay; i++) calendar.appendChild(document.createElement("div"));

    for (var day = 1; day <= daysInMonth; day++) {
      (function(d) {
        var dayEl    = document.createElement("div");
        dayEl.textContent = d;
        var fullDate = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
        var sess     = firestoreSessions[fullDate];

        if (sess) dayEl.classList.add("has-session");

        dayEl.addEventListener("click", function() {
          if (!sess) {
            sessionInfo.innerHTML = "<p>No tutoring sessions scheduled for this day.</p>";
            var bookPanel = document.getElementById("booking-panel");
            if (bookPanel) bookPanel.style.display = "none";
            return;
          }

          var enrolled  = (sess.enrolled || []).length;
          var capacity  = sess.capacity || 10;
          var spotsLeft = capacity - enrolled;
          sessionInfo.innerHTML =
            "<h3>Session Details</h3>" +
            "<p><strong>" + sess.subject + "</strong></p>" +
            "<p>" + sess.time + (sess.tutorName ? " · Tutor: " + sess.tutorName : "") + "</p>" +
            "<p style='font-size:0.85rem; color:#6b7280;'>" + enrolled + "/" + capacity + " spots taken" +
              (spotsLeft > 0 ? " — <strong style='color:#16a34a;'>" + spotsLeft + " open</strong>" : " — <strong style='color:#ef4444;'>Full</strong>") +
            "</p>";

          // Show booking panel
          if (typeof showBookingPanel === "function") {
            showBookingPanel(sess.id || fullDate, Object.assign({}, sess, { dateStr: fullDate }));
          }
        });

        calendar.appendChild(dayEl);
      })(day);
    }
  }

  document.getElementById("prevMonth").addEventListener("click", function() { date.setMonth(date.getMonth() - 1); renderCalendar(); });
  document.getElementById("nextMonth").addEventListener("click", function() { date.setMonth(date.getMonth() + 1); renderCalendar(); });

  renderCalendar();
});
