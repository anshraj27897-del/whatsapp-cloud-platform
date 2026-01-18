// 🔗 Google Sheet CSV public URL
const SHEET_ID = "1CVWhUsvuCJ-duBnh8o-kDeazROoPwTlXz3lQBeRzVTk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

async function fetchLeads() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text
      .trim()
      .split("\n")
      .map(r => r.split(","));

    // remove header row
    const data = rows.slice(1).filter(r => r.length >= 4);

    // ✅ TOTAL LEADS
    const totalLeadsEl = document.getElementById("totalLeads");
    if (totalLeadsEl) {
      totalLeadsEl.innerText = data.length;
    }

    // ✅ TABLE
    const tableBody = document.getElementById("leadTable");
    tableBody.innerHTML = "";

    data.reverse().slice(0, 20).forEach(row => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row[0] || "-"}</td>
        <td>${row[2] || "-"}</td>
        <td>${row[3] || "-"}</td>
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
