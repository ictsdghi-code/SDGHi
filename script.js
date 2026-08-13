// ==========================================
// 🔐 PASSWORD SETTINGS — PALITAN DITO KUNG GUSTO MO!
// ==========================================
const CORRECT_PASSWORD = "Stdgh@2024!";

let selectedFileUrl = "";
let priceData = [];
let activePriceCategory = "";

const priceCategoryMap = {
    emergency: "Emergency Services",
    inpatient: "Inpatient Services",
    laboratory: "Laboratory Services",
    radiology: "Radiology Services",
    outpatient: "Outpatient Services",
    mab: "Medical Art Building (MAB)",
    pharmacy: "Pharmacy Services"
};

// ==========================================
// 📄 PDF VIEWER FUNCTIONS
// ==========================================
function openPdfViewer(pdfUrl, fileName) {
    const cleanUrl = pdfUrl + "#toolbar=0&navpanes=0&scrollbar=1";
    document.getElementById('pdfViewerFrame').src = cleanUrl;
    document.getElementById('pdfFileName').textContent = fileName;
    document.getElementById('pdfViewerModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePdfViewer(event) {
    if (!event || event.target.id === 'pdfViewerModal' || event.target.classList.contains('pdf-close')) {
        document.getElementById('pdfViewerModal').style.display = 'none';
        document.getElementById('pdfViewerFrame').src = '';
        document.body.style.overflow = '';
    }
}

// ==========================================
// 🔒 PASSWORD PROTECTION FUNCTIONS
// ==========================================
function requestPassword(button) {
    selectedFileUrl = button.getAttribute("data-file");
    const fileName = button.getAttribute("data-name");
    document.getElementById("fileToDownloadName").textContent = "File: " + fileName;
    document.getElementById("downloadPassword").value = "";
    document.getElementById("passwordError").style.display = "none";
    document.getElementById("passwordModal").style.display = "flex";
    document.getElementById("passwordModal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closePasswordModal() {
    document.getElementById("passwordModal").style.display = "none";
    document.getElementById("passwordModal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    selectedFileUrl = "";
}

function checkPassword() {
    const input = document.getElementById("downloadPassword").value;
    if (input === CORRECT_PASSWORD) {
        window.location.href = selectedFileUrl;
        closePasswordModal();
    } else {
        document.getElementById("passwordError").style.display = "block";
    }
}

// ==========================================
// 💰 KUKUNIN NA LANG MULA SA CSV — WALANG PRESYO DITO!
// ==========================================
async function loadPriceListFromCSV() {
    try {
      // ✅ Kukunin ang presyo mula sa UPLOADED mong CSV sa GitHub
      const res = await fetch(`https://raw.githubusercontent.com/ictsdghi-code/SDGHi/main/data/price-list.csv?v=${Date.now()}`);
      if (!res.ok) throw Error("Hindi makuha ang CSV");
      
      const text = await res.text();
      const lines = text.trim().split("\n").filter(line => line.trim() !== "");
      
      priceData = [];
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        const status = (row[5] || "").trim().toLowerCase();
        
        // ✅ IPAPAKITA LANG KUNG "Active" — itatago ang Inactive
        if (status !== "active") continue;

        priceData.push({
          category: row[0]?.trim() || "",
          code: row[1]?.trim() || "",
          service: row[2]?.trim() || "",
          description: row[3]?.trim() || "",
          price: row[4]?.trim() || "0",
          status: status
        });
      }
      
      console.log("✅ Presyo na-load mula sa CSV!", priceData);
    } catch (err) {
      alert("⚠️ Hindi mabasa ang price list. Siguraduhing na-upload ang CSV!");
      console.error("Error:", err.message);
      priceData = []; // ❌ Wala nang nakalagay na presyo dito
    }
}

// ✅ Tamang paghiwalay ng CSV
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

function formatPrice(val) {
    const num = Number(String(val).replace(/[^0-9.-]/g, ""));
    return Number.isNaN(num) ? String(val || "") : "₱" + num.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showPriceList(categoryKey) {
    activePriceCategory = priceCategoryMap[categoryKey] || categoryKey;
    document.getElementById("priceModalTitle").textContent = activePriceCategory + " - Price List";
    document.getElementById("priceModalDescription").textContent = "Current rates from the hospital price list.";
    document.getElementById("modalPriceSearch").value = "";
    renderModalPrices();
    document.getElementById("priceListModal").classList.add("active");
    document.getElementById("priceListModal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function renderModalPrices() {
    const tbody = document.getElementById("modalPriceTableBody");
    const search = document.getElementById("modalPriceSearch").value.toLowerCase().trim();
    const filtered = priceData.filter(item =>
        item.category.toLowerCase() === activePriceCategory.toLowerCase() &&
        (!search || item.code.toLowerCase().includes(search) || item.service.toLowerCase().includes(search) || item.description.toLowerCase().includes(search))
    );
    tbody.innerHTML = filtered.length ? "" : '<tr><td colspan="4" style="text-align:center;">No matching price list item found.</td></tr>';
    filtered.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.code}</td><td><strong>${item.service}</strong>${item.description?"<br><small>"+item.description+"</small>":""}</td><td>${formatPrice(item.price)}</td><td>${item.status||"Active"}</td>`;
        tbody.appendChild(tr);
    });
}

function closePriceList() {
    document.getElementById("priceListModal").classList.remove("active");
    document.getElementById("priceListModal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// ==========================================
// 📄 LIGHTBOX & OTHER FUNCTIONS
// ==========================================
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightbox.style.display = 'block';
  lightboxImg.src = imgSrc;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function showMessage() {
    alert("Welcome to Saint Dominic General Hospital, Inc.!");
}

function toggleService(serviceId) {
    const section = document.getElementById(serviceId);
    if (!section) return;
    section.style.display = section.style.display === "block" ? "none" : "block";
    if (section.style.display === "block") section.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function() {
    document.getElementById('scrollTopBtn').style.display = 
        (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "block" : "none";
};

// ==========================================
// 🚀 SIMULAN — MAGBASA NG CSV
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    await loadPriceListFromCSV(); // ✅ Mula sa CSV na lahat!
    document.getElementById("modalPriceSearch").addEventListener("input", renderModalPrices);
    document.getElementById("priceListModal").addEventListener("click", e => {
        if (e.target.id === "priceListModal") closePriceList();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") { closePriceList(); closePasswordModal(); closePdfViewer(); }
    });
});
