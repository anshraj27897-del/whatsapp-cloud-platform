<script>
const SHEET_URL = "1CVWhUsvuCJ-duBnh8o-kDeazROoPwTlXz3lQBeRzVTk";

async function fetchLeads() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const rows = text.split("\n").map(r => r.split(","));

    const headers = rows[0];
    const data = rows.slice(1).filter(r => r.length > 3);

    document.getElementById("totalLeads").innerText = data.length;

    const tableBody = document.getElementById("leadsTable");
    tableBody.innerHTML = "";

    data.reverse().slice(0, 20).forEach(row => {
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
    console.error("Error loading leads", err);
  }
}

// Load on page open
fetchLeads();

// Auto refresh every 30 sec
setInterval(fetchLeads, 30000);
</script>
