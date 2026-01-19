const SHEET_ID = "1CVWhUsvuCJ-duBnh8o-kDeazROoPwTlXz3lQBeRzVTk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

function parseCSV(text) {
  const rows = [];
  let row = [];
  let val = "";
  let inQuotes = false;

  for (let c of text) {
    if (c === '"') inQuotes = !inQuotes;
    else if (c === "," && !inQuotes) {
      row.push(val);
      val = "";
    } else if (c === "\n" && !inQuotes) {
      row.push(val);
      rows.push(row);
      row = [];
      val = "";
    } else {
      val += c;
    }
  }
  if (val) {
    row.push(val);
    rows.push(row);
  }
  return rows;
}

// ✅ DD/MM/YYYY safe parser
function parseIndianDate(dateStr) {
  const [d, m, rest] = dateStr.split("/");
  const [y, time] = rest.split(" ");
  return new Date(`${y}-${m}-${d} ${time}`);
}

function isToday(dateStr) {
  const d = parseIndianDate(dateStr);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

async function fetchLeads() {
  try {
    const res = await fetch(SHEET_URL + "&v=" + Date.now()); // cache bust
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
    console.error("Dashboard error:", e);
  }
}

fetchLeads();
setInterval(fetchLeads, 30000);
