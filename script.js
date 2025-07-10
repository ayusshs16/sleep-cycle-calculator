function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function setCurrentTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('time').value = `${hh}:${mm}`;
}

function clearResult() {
  document.getElementById('result').innerHTML = "";
}

function saveRecord(entry) {
  const username = localStorage.getItem("currentUser");
  if (!username) return;
  const key = `sleepHistory_${username}`;
  let history = JSON.parse(localStorage.getItem(key)) || [];
  history.unshift(entry);
  localStorage.setItem(key, JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const username = localStorage.getItem("currentUser");
  if (!username) return;
  const key = `sleepHistory_${username}`;
  let history = JSON.parse(localStorage.getItem(key)) || [];
  if (history.length === 0) {
    document.getElementById("history").innerHTML = "<em>No sleep records yet.</em>";
    return;
  }
  let html = "<strong>📝 Your Sleep Records:</strong><br>";
  history.forEach((entry, i) => {
    html += `${i + 1}. ${entry}<br>`;
  });
  document.getElementById("history").innerHTML = html;
}

function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Please enter a username!");
  localStorage.setItem("currentUser", username);
  document.getElementById("currentUser").textContent = username;
  document.getElementById("loginArea").style.display = "none";
  document.getElementById("logoutArea").style.display = "block";
  loadHistory();
}

function logout() {
  localStorage.removeItem("currentUser");
  document.getElementById("currentUser").textContent = "";
  document.getElementById("loginArea").style.display = "block";
  document.getElementById("logoutArea").style.display = "none";
  document.getElementById("history").innerHTML = "";
}

function calculateWakeTimes() {
  const timeInput = document.getElementById('time').value;
  if (!timeInput) return alert("Please enter a time!");

  let [hours, minutes] = timeInput.split(":").map(Number);
  let sleepTime = new Date();
  sleepTime.setHours(hours);
  sleepTime.setMinutes(minutes);
  sleepTime.setSeconds(0);

  let resultHTML = "<strong>⏰ Wake up at one of these times:</strong><br>";
  for (let i = 1; i <= 6; i++) {
    let wakeTime = new Date(sleepTime.getTime() + (i * 90 + 15) * 60000);
    resultHTML += `🕒 ${formatTime(wakeTime)} — ${i * 1.5} hours<br>`;
  }
  document.getElementById('result').innerHTML = resultHTML;

  saveRecord(`Calculated wake times from ${timeInput} (${new Date().toLocaleString()})`);
}

function calculateBedTimes() {
  const timeInput = document.getElementById('time').value;
  if (!timeInput) return alert("Please enter a time!");

  let [hours, minutes] = timeInput.split(":").map(Number);
  let wakeTime = new Date();
  wakeTime.setHours(hours);
  wakeTime.setMinutes(minutes);
  wakeTime.setSeconds(0);

  let resultHTML = "<strong>🛏️ Go to bed at one of these times:</strong><br>";
  for (let i = 6; i >= 1; i--) {
    let bedTime = new Date(wakeTime.getTime() - (i * 90 + 15) * 60000);
    resultHTML += `🕒 ${formatTime(bedTime)} — ${i * 1.5} hours<br>`;
  }
  document.getElementById('result').innerHTML = resultHTML;

  saveRecord(`Calculated bed times for waking at ${timeInput} (${new Date().toLocaleString()})`);
}

document.getElementById('modeButton').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('modeButton').textContent = isDark ? '🌙 Dark Mode' : '🌞 Light Mode';
});

// Auto-load login state
window.addEventListener("load", () => {
  const username = localStorage.getItem("currentUser");
  if (username) {
    document.getElementById("currentUser").textContent = username;
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("logoutArea").style.display = "block";
    loadHistory();
  }
});
