// =============================================
// SELEKSI ELEMEN
// =============================================
const formKalkulator = document.getElementById('form-kalkulator');
const areaHasil = document.getElementById('hasil-kalkulasi');
const teksRincian = document.getElementById('teks-rincian');
const teksTotal = document.getElementById('teks-total');

const inputLamaHari = document.getElementById('lama-hari');
const cekFotografer = document.getElementById('cek-fotografer');

// =============================================
// FITUR 1: DISABLED LOGIC - Fotografer min. 2 hari
// Dipasang di input 'lama-hari' agar real-time
// =============================================
inputLamaHari.addEventListener('input', function () {
    const hari = parseInt(this.value);

    if (hari < 2 || isNaN(hari)) {
        // Nonaktifkan dan hapus centang kalau hari < 2
        cekFotografer.disabled = true;
        cekFotografer.checked = false;
    } else {
        // Aktifkan kembali kalau hari >= 2
        cekFotografer.disabled = false;
    }
});

// =============================================
// FITUR 2, 3, 4: Kalkulasi saat form di-submit
// =============================================
formKalkulator.addEventListener('submit', function (event) {
    event.preventDefault();

    // --- Ambil nilai input ---
    const namaRombongan = document.getElementById('Nama kepala Rombongan').value;
    const jumlahOrang = parseInt(document.getElementById('jumlah-orang').value);
    const lamaHari = parseInt(document.getElementById('lama-hari').value);
    const hargaPaket = parseInt(document.getElementById('paket-wisata').value);
    const kodePromo = document.getElementById('kode-promo').value;

    // --- Validasi input dasar ---
    if (jumlahOrang <= 0 || lamaHari < 1) {
        alert("Jumlah orang dan lama hari tidak boleh kurang dari 1!");
        return;
    }
    if (isNaN(hargaPaket)) {
        alert("Silakan pilih paket wisata terlebih dahulu!");
        return;
    }

    // =============================================
    // KALKULASI SUB-TOTAL TIKET
    // =============================================
    const subTotalTiket = jumlahOrang * lamaHari * hargaPaket;

    // Cek diskon rombongan (lebih dari 5 orang = diskon 10%)
    let pesanDiskon = "";
    let totalSetelahDiskon = subTotalTiket;

    if (jumlahOrang > 5) {
        const nilaiDiskon = subTotalTiket * 0.10;
        totalSetelahDiskon = subTotalTiket - nilaiDiskon;
        pesanDiskon = `<span style="color:green;">✓ Diskon rombongan 10% diterapkan</span>`;
    }

    // =============================================
    // FITUR 2: KALKULASI LAYANAN TAMBAHAN
    // Asuransi: Rp 50.000 x jumlah orang
    // Fotografer: Rp 300.000 x lama hari
    // =============================================
    let biayaAsuransi = 0;
    let biayaFotografer = 0;

    const cekAsuransi = document.getElementById('cek-asuransi');

    if (cekAsuransi.checked) {
        biayaAsuransi = 50000 * jumlahOrang;
    }
    if (cekFotografer.checked) {
        biayaFotografer = 300000 * lamaHari;
    }

    const subTotalLayanan = biayaAsuransi + biayaFotografer;

    // =============================================
    // FITUR 3: VALIDASI KODE PROMO
    // "ACEHHEBAT" case-insensitive → potong Rp 150.000
    // Total tidak boleh negatif
    // =============================================
    let potonganPromo = 0;
    let pesanPromo = "";

    if (kodePromo.toUpperCase() === "ACEHHEBAT") {
        potonganPromo = 150000;
        pesanPromo = `<span style="color:green;">✓ Kode promo ACEHHEBAT berhasil!</span>`;
    } else if (kodePromo !== "") {
        pesanPromo = `<span style="color:red;">✗ Kode promo tidak valid</span>`;
    }

    // Hitung total akhir
    let totalBayar = totalSetelahDiskon + subTotalLayanan - potonganPromo;

    // Pastikan total tidak negatif
    if (totalBayar < 0) {
        totalBayar = 0;
    }

    // =============================================
    // FITUR 4: TAMPILKAN RINCIAN KE HTML (DOM Manipulation)
    // =============================================

    // Fungsi format Rupiah
    const formatRupiah = (angka) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

    // Tampilkan area hasil
    areaHasil.classList.remove('hidden');

    // Isi rincian
    teksRincian.innerHTML = `
        <strong>Nama Kepala Rombongan:</strong> ${namaRombongan}<br><br>

        📋 <strong>Sub-total Tiket:</strong><br>
        &nbsp;&nbsp;${jumlahOrang} orang × ${lamaHari} hari × ${formatRupiah(hargaPaket)} 
        = ${formatRupiah(subTotalTiket)}<br>
        ${pesanDiskon ? '&nbsp;&nbsp;' + pesanDiskon + '<br>' : ''}
        <br>

        🛎️ <strong>Sub-total Layanan Tambahan:</strong><br>
        ${biayaAsuransi > 0
            ? `&nbsp;&nbsp;Asuransi: Rp 50.000 × ${jumlahOrang} orang = ${formatRupiah(biayaAsuransi)}<br>`
            : '&nbsp;&nbsp;Tidak ada<br>'
        }
        ${biayaFotografer > 0
            ? `&nbsp;&nbsp;Fotografer: Rp 300.000 × ${lamaHari} hari = ${formatRupiah(biayaFotografer)}<br>`
            : ''
        }
        <br>

        🎟️ <strong>Potongan Promo:</strong><br>
        &nbsp;&nbsp;${potonganPromo > 0
            ? `${formatRupiah(potonganPromo)} — ${pesanPromo}`
            : pesanPromo || 'Tidak ada'
        }<br>
    `;

    // Isi total
    teksTotal.innerHTML = `💰 TOTAL BAYAR: <strong>${formatRupiah(totalBayar)}</strong>`;
});