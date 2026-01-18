// 🔗 Google Sheet CSV public URL
const SHEET_ID = "1CVWhUsvuCJ-duBnh8o-kDeazROoPwTlXz3lQBeRzVTk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  if (d.getFullYear() < 2023) return false; // remove 1899, junk dates
  return true;
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

async function fetchLeads() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text
      .trim()
      .split("\n")
      .map(r => r.split(","));

    // Remove header
    let data = rows.slice(1);

    // ✅ CLEAN DATA
    data = data.filter(r =>
      r.length >= 4 &&
      isValidDate(r[0]) &&
      r[2] &&
      r[2] !== "-" &&
      r[3] &&
      r[3] !== "-"
    );

    // ✅ TOTAL LEADS
    document.getElementById("totalLeads").innerText = data.length;

    // ✅ TODAY LEADS
    const todayCount = data.filter(r => isToday(r[0])).length;
    document.getElementById("todayLeads").innerText = todayCount;

    // ✅ TABLE
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
          <td>${row[5] || "General"}</td>
        `;
        tableBody.appendChild(tr);
      });

  } catch (err) {
    console.error("❌ Error loading leads:", err);
  }
}

// 🚀 Load on page open
fetchLeads();

// 🔄 Auto refresh every 30 sec
setInterval(fetchLeads, 30000);
