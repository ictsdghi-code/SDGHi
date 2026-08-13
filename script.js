// ==========================================
// ✅ INAYAWAN NA — TUMUTUGMA SA CSV MO!
// CSV columns: Category,Service Code,Service Name,Description,Price,Status
// ==========================================
let priceData = [];
let activePriceCategory = "";

// ==========================================
// 👇 KUNG HINDI MAKUHA ANG CSV, ITO ANG GAGAMITIN
// ==========================================
const localPriceData = [
	// ✅ LABORATORY SERVICES
    {category:"Laboratory Services",code:"LAB-001",service:"Complete Blood Count",description:"Hematology test",price:350,status:"Active"},
    {category:"Laboratory Services",code:"LAB-002",service:"Urinalysis",description:"Routine urine examination",price:150,status:"Active"},
    {category:"Laboratory Services",code:"LAB-003",service:"Fecalysis",description:"Stool examination",price:150,status:"Active"},
    {category:"Laboratory Services",code:"LAB-004",service:"Blood Typing",description:"ABO and Rh typing",price:200,status:"Active"},
	// ✅ X-RAY SERVICES
    {category:"Radiology Services",code:"RAD-001",service:"Chest X-Ray",description:"Chest radiographic examination",price:500,status:"Active"},
    {category:"Radiology Services",code:"RAD-002",service:"Abdominal X-Ray",description:"Abdominal radiographic examination",price:600,status:"Active"},
	// ✅ ULTRASOUND SERVICES
    {category:"Ultrasound Services",code:"US-001",service:"Whole Abdominal Ultrasound",description:"Diagnostic ultrasound",price:1200,status:"Active"},
    {category:"Ultrasound Services",code:"US-002",service:"Pelvic Ultrasound",description:"Pelvic diagnostic ultrasound",price:1000,status:"Active"},
	// ✅ ER SERVICES
    {category:"Emergency Services",code:"ER-001",service:"Emergency Consultation",description:"Emergency medical consultation",price:500,status:"Active"},
	// ✅ OPD SERVICES
    {category:"Outpatient Services",code:"OPD-001",service:"Medical Consultation",description:"Outpatient consultation",price:500,status:"Active"},
	// ✅ IPD SERVICES
    {category:"Inpatient Services",code:"IP-001",service:"Private Room Rate",description:"Private room rate per day",price:3500,status:"Active"},
	// ✅ MAB SERVICES
    {category:"Medical Art Building (MAB)",code:"MAB-001",service:"Specialist Consultation",description:"Medical specialist consultation",price:800,status:"Active"}
];

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
// ✅ BINABASA NA ANG TAMA NG AYOS NG CSV MO!
// ==========================================
async function loadPriceListFromCSV() {
    try {
      // ✅ Direktang kukuha sa tamang URL
      const res = await fetch(`https://raw.githubusercontent.com/ictsdghi-code/SDGHi/main/data/price-list.csv?v=${Date.now()}`);
      if (!res.ok) throw Error("Hindi makuha ang CSV");
      
      const text = await res.text();
      const lines = text.trim().split("\n").filter(line => line.trim() !== "");
      
      priceData = [];
      // ✅ Laktawan ang unang linya (pamagat) → simula sa pangalawang linya
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        // ✅ TAMA NA ANG AYOS: Category,Service Code,Service Name,Description,Price,Status
        priceData.push({
          category: row[0]?.trim() || "",
          code: row[1]?.trim() || "",
          service: row[2]?.trim() || "",
          description: row[3]?.trim() || "",
          price: row[4]?.trim() || "0",
          status: row[5]?.trim() || "Active"
        });
      }
      
      console.log("✅ Presyo na-load mula sa CSV!", priceData);
    } catch (err) {
      console.warn("⚠️ Gamit ang nakalagay na presyo:", err.message);
      priceData = localPriceData;
    }
}

// ✅ Tamang paghiwalay ng CSV (hindi magkakamali sa kuwit)
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
    const modal = document.getElementById("priceListModal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
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
    const modal = document.getElementById("priceListModal");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function showMessage() {
    alert("Welcome to Saint Dominic General Hospital, Inc.!");
}

function toggleService(serviceId) {
    console.log("Binuksan:", serviceId);
    const serviceSection = document.getElementById(serviceId);
    if (!serviceSection) {
        console.error("Hindi mahanap:", serviceId);
        return;
    }
    if (serviceSection.style.display === "block") {
        serviceSection.style.display = "none";
    } else {
        serviceSection.style.display = "block";
        serviceSection.scrollIntoView({ behavior: "smooth" });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadPriceListFromCSV();
    document.getElementById("modalPriceSearch").addEventListener("input", renderModalPrices);
    document.getElementById("priceListModal").addEventListener("click", e => {
        if (e.target.id === "priceListModal") closePriceList();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closePriceList();
    });
});

// ===== LIGHTBOX FUNCTIONS =====
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightbox.style.display = 'block';
  lightboxImg.src = imgSrc;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ===== SCROLL TO TOP FUNCTION =====
window.onscroll = function() {
  const btn = document.getElementById('scrollTopBtn');
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
