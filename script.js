// ==========================================
// 🔐 PASSWORD SETTINGS — PALITAN DITO KUNG GUSTO MO!
// ==========================================
const CORRECT_PASSWORD = "Stdgh@2024!";
let selectedFileUrl = "";

// ==========================================
// 📄 PDF VIEWER FUNCTIONS
// ==========================================
function openPdfViewer(pdfUrl, fileName) {
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
// ✅ PRICE LIST DATA & FUNCTIONS
// ==========================================
let priceData = [];
let activePriceCategory = "";

const localPriceData = [
    {category:"Laboratory Services",code:"LAB-001",service:"Complete Blood Count",description:"Hematology test",price:350,status:"Active"},
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
      if (!res.ok) throw Error("Hindi makuha ang CSV");
      
      const text = await res.text();
      const lines = text.trim().split("\n").filter(line => line.trim() !== "");
      
      priceData = [];
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        const status = (row[5] || "").trim();
        
        if (status.toLowerCase() !== "active") {
          continue;
        }

        priceData.push({
         
