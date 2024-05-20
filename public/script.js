// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");

// Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};
// Klik di luar Sidebar

const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Const Form (start)

// Const Form (end)

// Penghapus Angka Kades (start)

const kadesInput = document.getElementById("kadesInput");

kadesInput.addEventListener("input", function () {
  const value = kadesInput.value;
  const sanitizedValue = value.replace(/\d/g, ""); // Remove numeric characters

  kadesInput.value = sanitizedValue;
});

// Penghapus Angka Kades (end)

// Penghapus Angka Nama (start)

const namaInput = document.getElementById("namaInput");

namaInput.addEventListener("input", function () {
  const value = namaInput.value;
  const sanitizedValue = value.replace(/\d/g, ""); // Remove numeric characters

  namaInput.value = sanitizedValue;
});

//  Angka Nama (end)

// Penghapus Huruf Tahun (start)

const tahunInput = document.getElementById("tahunInput");

tahunInput.addEventListener("input", function () {
  const value = tahunInput.value;
  const sanitizedValue = value.replace(/\D/g, ""); // Remove non-numeric characters

  tahunInput.value = sanitizedValue;
});

// Penghapus Huruf Tahun (end)

// Penghapus Angka 0 (start)

const tanggalInput = document.getElementById("tanggalInput");

tanggalInput.addEventListener("input", function () {
  let value = this.value;

  // Remove leading zeros
  value = value.replace(/^0+/, "");

  // Remove non-digit characters
  value = value.replace(/\D/g, "");

  // Limit maximum value to 31
  if (value > 31) {
    value = "31";
  }

  this.value = value;
});

// Penghapus Angka 0 (end)

// Pembuat Kapital (start)

const desaField = document.getElementById("desaInput");

desaField.addEventListener("input", function () {
  const value = desaField.value;
  const sanitizedValue = sanitizeInput(value);
  const capitalizedValue = capitalizeFirstWord(sanitizedValue);
  desaField.value = capitalizedValue;
});

function sanitizeInput(input) {
  const sanitized = input.replace(/[^a-zA-Z\s]/g, "");
  return sanitized;
}

function capitalizeFirstWord(str) {
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

// Pembuat Kapital (end)

// Lampiran (start)
const angkaSelect = document.getElementById("angkaSelect");

for (let i = 0; i <= 99; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.text = i;
  angkaSelect.appendChild(option);
}
const angkaSelect2 = document.getElementById("angkaSelect2");

for (let i = 0; i <= 99; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.text = i;
  angkaSelect2.appendChild(option);
}

// Lampiran (end)

// Logic Angka Only (start)

function restrictToNumbers(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}

// Logic Angka Only (end)

// Pindah Surat (start)

// Pindah Surat (end)
