// 🔗 Google Sheet CSV public URL
const SHEET_ID = "1CVWhUsvuCJ-duBnh8o-kDeazROoPwTlXz3lQBeRzVTk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// 🧠 CSV line safe parser (handles commas, emojis, line breaks)
function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map(row => {
      const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      return parts.map(p => p.replace(/^"|"$/g, "").trim());
    });
}

// 🟢 Check if date exists (simple, demo-safe)
function hasDate(value) {
  return value && value.length > 5;
}

// 🟢 Check today (safe)
function isToday(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

async function fetchLeads() {
  try {
    const res = await fetch(SHEET_URL + "&_=" + Date.now()); // cache-buster
    const text = await res.text();

    const rows = parseCSV(text);

    // remove header
    let data = rows.slice(1);

    // ✅ CLEAN + SAFE FILTER
    data = data.filter(r =>
      r.length >= 4 &&
      hasDate(r[0]) &&
      r[2] && r[2] !== "-" &&
      r[3] && r[3] !== "-"
    );

    // ✅ TOTAL LEADS
    document.getElementById("totalLeads").innerText = data.length;

    // ✅ TODAY LEADS
    const todayCount = data.filter(r => isToday(r[0])).length;
    document.getElementById("todayLeads").innerText = todayCount;

    // ✅ TABLE RENDER
    const tableBody = document.getElementById("leadTable");
    tableBody.innerHTML = "";

    data
      .reverse()
      .slice(0, 20)
      .forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row[0]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[5] ? row[5] : "General"}</td>
        `;
        tableBody.appendChild(tr);
      });

  } catch (err) {
    console.error("❌ Admin panel load error:", err);
  }
}

// 🚀 Load on page open
fetchLeads();

// 🔄 Auto refresh every 30 sec
setInterval(fetchLeads, 30000);
