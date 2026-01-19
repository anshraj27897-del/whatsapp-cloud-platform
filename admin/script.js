const SHEET_ID = "1CVWhUsvuCJ-duBnh8o-kDeazROoPwTlXz3lQBeRzVTk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

function parseCSV(text) {
  const rows = [];
  let current = [];
  let insideQuotes = false;
  let value = "";

  for (let char of text) {
    if (char === '"' ) {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      current.push(value.trim());
      value = "";
    } else if (char === "\n" && !insideQuotes) {
      current.push(value.trim());
      rows.push(current);
      current = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value) {
    current.push(value.trim());
    rows.push(current);
  }
  return rows;
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

async function fetchLeads() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = parseCSV(text);

    const data = rows.slice(1).filter(r => r[0] && r[2] && r[3]);

    document.getElementById("totalLeads").innerText = data.length;

    document.getElementById("todayLeads").innerText =
      data.filter(r => isToday(r[0])).length;

    const table = document.getElementById("leadTable");
    table.innerHTML = "";

    data.reverse().slice(0, 20).forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r[0]}</td>
        <td>${r[2]}</td>
        <td>${r[3]}</td>
        <td>${r[5] || "General"}</td>
      `;
      table.appendChild(tr);
    });

  } catch (e) {
    console.error("Admin fetch error:", e);
  }
}

fetchLeads();
setInterval(fetchLeads, 30000);
