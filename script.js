// ==========================================
// 🔐 PASSWORD SETTINGS
// ==========================================
const CORRECT_PASSWORD = "Stdgh@2024!";
let selectedFileUrl = "";

// ==========================================
// 📄 PDF VIEWER FUNCTIONS
// ==========================================
function openPdfViewer(pdfUrl, fileName) {
    console.log("Opening PDF:", pdfUrl, fileName);
    document.getElementById('pdfViewerFrame').src = pdfUrl;
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
    console.log("Request password for:", button);
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
// 💡 TEST FUNCTION
// ==========================================
function showMessage() {
    alert("Welcome to Saint Dominic General Hospital, Inc.!");
}

// ==========================================
// 🔄 SERVICE TOGGLE FUNCTION
// ==========================================
function toggleService(serviceId) {
    console.log("Opening:", serviceId);
    const section = document.getElementById(serviceId);
    if (!section) return;
    if (section.style.display === "block") {
        section.style.display = "none";
    } else {
        section.style.display = "block";
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// ==========================================
// 📊 PRICE LIST FUNCTIONS
// ==========================================
let priceData = [];
let activePriceCategory = "";

const localPriceData = [
    {category:"Laboratory Services",code:"LAB-001",service:"Complete Blood Count",description:"Hematology test",price:850,status:"Active"},
    {category:"Laboratory Services",code:"LAB-002",service:"Urinalysis",description:"Routine urine examination",price:150,status:"Active"},
    {category:"Laboratory Services",code:"LAB-003",service:"Fecalysis",description:"Stool examination",price:150,status:"Active"},
    {category:"Laboratory Services",code:"LAB-004",service:"Blood Typing",description:"ABO and Rh typing",price:200,status:"Active"},
    {category:"Radiology Services",code:"RAD-001",service:"Chest X-Ray",description:"Chest radiographic examination",price:500,status:"Active"},
    {category:"Radiology Services",code:"RAD-002",service:"Abdominal X-Ray",description:"Abdominal radiographic examination",price:600,status:"Active"},
    {category:"Ultrasound Services",code:"US-001",service:"Whole Abdominal Ultrasound",description:"Diagnostic ultrasound",price:1200,status:"Active"},
    {category:"Ultrasound Services",code:"US-002",service:"Pelvic Ultrasound",description:"Pelvic diagnostic ultrasound",price:1000,status:"Active"},
    {category:"Emergency Services",code:"ER-001",service:"Emergency Consultation",description:"Emergency medical consultation",price:500,status:"Active"},
    {category:"Outpatient Services",code:"OPD-001",service:"Medical Consultation",description:"Outpatient consultation",price:500,status:"Active"},
    {category:"Inpatient Services",code:"IP-001",service:"Private Room Rate",description:"Private room rate per day",price:3500,status:"Active"},
    {category:"Medical Art Building (MAB)",code:"MAB-001",service:"Specialist Consultation",description:"Medical specialist consultation",price:800,status:"Active"},
    {category:"Pharmacy Services",code:"PHARM-004",service:"Paracetamol 500mg",description:"Tablet per piece",price:12.50,status:"Active"},
    {category:"Pharmacy Services",code:"PHARM-005",service:"Amoxicillin Capsule 500mg",description:"Antibiotic per capsule",price:18.00,status:"Active"}
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
    try {
        const res = await fetch(`https://raw.githubusercontent.com/ictsdghi-code/SDGHi/main/data/price-list.csv?v=${Date.now()}`);
        if (!res.ok) throw Error("Cannot fetch CSV");
        const text = await res.text();
        const lines = text.trim().split("\n").filter(L => L.trim());
        priceData = [];
        for (let i = 1; i < lines.length; i++) {
            const row = parseCSVLine(lines[i]);
            const status = (row[5] || "").trim();
            if (status.toLowerCase() !== "active") continue;
            priceData.push({
                category: row[0]?.trim() || "",
                code: row[1]?.trim() || "",
                service: row[2]?.trim() || "",
                description: row[3]?.trim() || "",
                price: row[4]?.trim() || "0",
                status: status
            });
        }
    } catch {
        priceData = localPriceData.filter(i => i.status.toLowerCase() === "active");
    }
}

function parseCSVLine(line) {
    const res = [];
    let cur = "", quote = false;
    for (let c of line) {
        if (c === '"') quote = !quote;
        else if (c === ',' && !quote) { res.push(cur); cur = ""; }
        else cur += c;
    }
    res.push(cur);
    return res;
}

function formatPrice(val) {
    const n = Number(String(val).replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? val : "₱" + n.toLocaleString("en-PH", {minimumFractionDigits:2,maximumFractionDigits:2});
}

function showPriceList(key) {
    activePriceCategory = priceCategoryMap[key] || key;
    document.getElementById("priceModalTitle").textContent = activePriceCategory + " - Price List";
    document.getElementById("priceModalDescription").textContent = "Current rates from the hospital price list.";
    document.getElementById("modalPriceSearch").value = "";
    renderModalPrices();
    const m = document.getElementById("priceListModal");
    m.classList.add("active");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function renderModalPrices() {
    const tbody = document.getElementById("modalPriceTableBody");
    const q = document.getElementById("modalPriceSearch").value.toLowerCase().trim();
    const filtered = priceData.filter(item =>
        item.category.toLowerCase() === activePriceCategory.toLowerCase() &&
        (!q || item.code.toLowerCase().includes(q) || item.service.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
    );
    tbody.innerHTML = filtered.length ? "" : `<tr><td colspan="4" style="text-align:center;">No matching price list item found.</td></tr>`;
    filtered.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.code}</td><td><strong>${item.service}</strong>${item.description?"<br><small>"+item.description+"</small>":""}</td><td>${formatPrice(item.price)}</td><td>${item.status}</td>`;
        tbody.appendChild(tr);
    });
}

function closePriceList() {
    const m = document.getElementById("priceListModal");
    m.classList.remove("active");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// ==========================================
// 🖼️ LIGHTBOX
// ==========================================
function openLightbox(src) {
    document.getElementById("lightbox").style.display = "block";
    document.getElementById("lightbox-img").src = src;
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.body.style.overflow = "auto";
}

// ==========================================
// ⬆️ SCROLL TO TOP
// ==========================================
window.onscroll = function() {
    const btn = document.getElementById("scrollTopBtn");
    btn.style.display = (document.documentElement.scrollTop > 300) ? "block" : "none";
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 🚀 ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    await loadPriceListFromCSV();
    document.getElementById("modalPriceSearch").addEventListener("input", renderModalPrices);
    document.getElementById("priceListModal").addEventListener("click", e => {
        if (e.target.id === "priceListModal") closePriceList();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closePriceList();
            closePasswordModal();
            closePdfViewer();
        }
    });
});
