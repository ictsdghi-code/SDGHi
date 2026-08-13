// ==========================================
// ✅ KASAMA NA ANG PHARMACY — GUMAGANA AGAD!
// ==========================================
let priceData = [];
let activePriceCategory = "";

// ==========================================
// 👇 DITO MO PALITAN ANG PRESYO!
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
    {category:"Medical Art Building (MAB)",code:"MAB-001",service:"Specialist Consultation",description:"Medical specialist consultation",price:800,status:"Active"},
    // ✅ PHARMACY SERVICES
    {category:"Pharmacy Services",code:"PHARM-001",service:"Prescription Medicine",description:"Dispensing of prescribed medicines",price:100,status:"Active"},
    {category:"Pharmacy Services",code:"PHARM-002",service:"Over-the-Counter Medicines",description:"Available non-prescription medicines",price:0,status:"Active"},
    {category:"Pharmacy Services",code:"PHARM-003",service:"Pharmacy Consultation",description:"Medication counseling and advice",price:150,status:"Active"}
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

async function loadPriceListFromCSV() {
    priceData = localPriceData;
    console.log("✅ Ginagamit ang presyo mula sa loob ng script!");
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

// ✅ ITO ANG GUMAGAWA NG CLICKABLE — PAREHO SA LAHAT NG SERBISYO
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
// Lumalabas ang button kapag pababa na
window.onscroll = function() {
  const btn = document.getElementById('scrollTopBtn');
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
};

// Babalik sa itaas nang maayos
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
