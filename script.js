const body = document.documentElement;
const darkToggle = document.getElementById("dark");
const input = document.querySelector(".user");
const searchBtn = document.getElementById("searchBtn");
const dashboard = document.getElementById("dashboard");
const toastEl = document.getElementById("toast");

const els = {
  avatar: document.querySelector(".avatar"),
  name: document.querySelector(".name"),
  username: document.querySelector(".username"),
  about: document.querySelector(".about"),
  ranking: document.querySelector(".ranking"),
  country: document.querySelector(".country"),
  company: document.querySelector(".company"),
  school: document.querySelector(".school"),
  github: document.querySelector(".github"),
  linkedin: document.querySelector(".linkedin"),
  twitter: document.querySelector(".twitter"),

  rating: document.querySelector(".rating"),
  globalRank: document.querySelector(".global-rank"),
  topPercentage: document.querySelector(".top-percentage"),
  attended: document.querySelector(".attended"),

  easySolved: document.querySelector(".easySolved"),
  mediumSolved: document.querySelector(".mediumSolved"),
  hardSolved: document.querySelector(".hardSolved"),
  totalSolved: document.querySelector(".totalSolved"),

  languages: document.querySelector(".languages"),
  skills: document.querySelector(".skills"),
  submissions: document.querySelector(".submissions"),
};

searchBtn.addEventListener("click", searchUser);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchUser();
});

darkToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);

  const icon = darkToggle.querySelector("i");
  icon.className = newTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
});

async function searchUser() {
  const username = input.value.trim();

  if (!username) {
    showToast("Please enter a LeetCode username", "fa-triangle-exclamation");
    return;
  }

  try {
    searchBtn.classList.add("loading");
    searchBtn.querySelector(".btn-text").innerText = "Analyzing";
    searchBtn.querySelector(".btn-icon").className =
      "fa-solid fa-circle-notch btn-icon";

    dashboard.classList.remove("active");

    const API_BASE = `https://alfa-leetcode-api.onrender.com/${username}`;

    const [profileRes, contestRes, solvedRes, languageRes, submissionRes] =
      await Promise.all([
        fetch(API_BASE),
        fetch(`${API_BASE}/contest`),
        fetch(`${API_BASE}/solved`),
        fetch(`${API_BASE}/language`),
        fetch(`${API_BASE}/acSubmission?limit=5`),
      ]);

    const profile = await profileRes.json();

    if (profile.errors || profile.message === "User not found")
      throw new Error("User Not Found");

    const contest = await contestRes.json();
    const solved = await solvedRes.json();
    const language = await languageRes.json();
    const submission = await submissionRes.json();

    fillProfile(profile);
    fillContest(contest);
    fillSolved(solved);
    fillLanguages(language);
    fillSkills(profile.skillTags || []);
    fillSubmissions(submission);

    setTimeout(() => {
      dashboard.classList.add("active");
    }, 100);
  } catch (error) {
    console.error(error);
    showToast("User not found or API limits reached.", "fa-circle-xmark");
  } finally {
    searchBtn.classList.remove("loading");
    searchBtn.querySelector(".btn-text").innerText = "Analyze";
    searchBtn.querySelector(".btn-icon").className =
      "fa-solid fa-arrow-right btn-icon";
  }
}

function fillProfile(p) {
  els.avatar.src = p.avatar || "https://via.placeholder.com/150";
  els.name.innerText = p.name || "No Name Provided";
  els.username.innerText = `@${p.username}`;
  els.about.innerText =
    p.about || "This user prefers to keep an air of mystery about them.";

  els.ranking.innerText = p.ranking ? p.ranking.toLocaleString() : "Unranked";
  els.country.innerText = p.country || "Earth";
  els.company.innerText = p.company || "Independent";
  els.school.innerText = p.school || "Self Taught";

  els.github.href = p.gitHub || "#";
  els.linkedin.href = p.linkedIN || "#";
  els.twitter.href = p.twitter || "#";

  [els.github, els.linkedin, els.twitter].forEach((el) => {
    el.style.opacity = el.getAttribute("href") === "#" ? "0.3" : "1";
    el.style.pointerEvents = el.getAttribute("href") === "#" ? "none" : "auto";
  });
}

function fillContest(c) {
  animateValue(els.rating, 0, Math.floor(c.contestRating || 0), 1000);
  animateValue(els.globalRank, 0, c.contestGlobalRanking || 0, 1500);
  animateValue(els.topPercentage, 0, c.contestTopPercentage || 0, 1000, true);
  animateValue(els.attended, 0, c.contestAttend || 0, 800);
}

function fillSolved(s) {
  animateValue(els.easySolved, 0, s.easySolved || 0, 1000);
  animateValue(els.mediumSolved, 0, s.mediumSolved || 0, 1200);
  animateValue(els.hardSolved, 0, s.hardSolved || 0, 1400);
  animateValue(els.totalSolved, 0, s.solvedProblem || 0, 1500);
}

function fillLanguages(l) {
  els.languages.innerHTML = "";
  if (!l.languageProblemCount || l.languageProblemCount.length === 0) {
    els.languages.innerHTML = "<span class='tag'>No language data</span>";
    return;
  }
  l.languageProblemCount.forEach((lang) => {
    const div = document.createElement("div");
    div.className = "tag";
    div.innerHTML = `${lang.languageName} <span style="opacity: 0.6; margin-left:6px;">${lang.problemsSolved}</span>`;
    els.languages.appendChild(div);
  });
}

function fillSkills(skills) {
  els.skills.innerHTML = "";
  if (!skills || skills.length === 0) {
    els.skills.innerHTML = "<span class='tag'>No skills listed</span>";
    return;
  }
  skills.forEach((skill) => {
    const div = document.createElement("div");
    div.className = "tag";
    div.innerText = skill;
    els.skills.appendChild(div);
  });
}

function fillSubmissions(s) {
  els.submissions.innerHTML = "";
  if (!s.submission || s.submission.length === 0) {
    els.submissions.innerHTML =
      "<div class='sub-row'>No recent submissions</div>";
    return;
  }
  s.submission.forEach((sub) => {
    const div = document.createElement("div");
    div.className = "sub-row";
    div.innerHTML = `
            <div>
                <div class="sub-title">${sub.title}</div>
                <div class="sub-meta">
                    <span><i class="fa-solid fa-code"></i> ${sub.lang}</span>
                    <span><i class="fa-regular fa-clock"></i> ${sub.timestamp ? new Date(sub.timestamp * 1000).toLocaleDateString() : "Recent"}</span>
                </div>
            </div>
            <div class="status">${sub.statusDisplay}</div>
        `;
    els.submissions.appendChild(div);
  });
}

function animateValue(obj, start, end, duration, isPercentage = false) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    let currentVal = Math.floor(easeOut * (end - start) + start);

    let displayVal = currentVal.toLocaleString();
    if (isPercentage) displayVal += "%";

    obj.innerHTML = displayVal;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerHTML = isPercentage ? end + "%" : end.toLocaleString();
    }
  };
  window.requestAnimationFrame(step);
}
let toastTimeout;
function showToast(message, iconClass) {
  toastEl.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${message}`;
  toastEl.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3500);
}