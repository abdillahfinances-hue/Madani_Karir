/* ===================================================
   form.js — logic formulir pendaftaran tentor
   5 Bagian sesuai PDF resmi Bimbel Madani
=================================================== */

/* Peta slug ?posisi= dari card lowongan -> kategori program */
const POSISI_MAP = {
  "tentor-bahasa-inggris": "KBI",
  "tentor-mengaji-pendidikan-islam": "KMPI",
  "tentor-mata-pelajaran-umum": "KMPU"
};

const STEPS = [
  { key: "diri", label: "Data Diri" },
  { key: "akademik", label: "Pendidikan" },
  { key: "program", label: "Program" },
  { key: "kualifikasi", label: "Kualifikasi" },
  { key: "operasional", label: "Komitmen" }
];

let currentStep = 0;
const formData = { berkas: [] };

/* ===== Prefill dari query string ?posisi=... ===== */
function getPosisiFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("posisi");
  return POSISI_MAP[slug] || null;
}

/* ===== Stepper ===== */
function renderStepper() {
  const el = document.getElementById("stepper");
  el.innerHTML = STEPS.map((s, i) => `
    <div class="step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}">
      <div class="dot">${i < currentStep ? '✓' : i + 1}</div>
      <span>${s.label}</span>
    </div>
  `).join('');
}

/* ===== Templates per Bagian (sesuai PDF) ===== */
function stepTemplate(index) {
  switch (STEPS[index].key) {

    case "diri": return `
      <h3>Bagian 1 — Data Diri Pelamar</h3>
      <p class="step-desc">Data ini dipakai tim rekrutmen untuk menghubungi kamu.</p>
      <div class="field">
        <label>Nama Lengkap &amp; Gelar <span class="req">*</span></label>
        <input type="text" name="nama_lengkap" placeholder="Tuliskan nama lengkap beserta gelar akademik jika ada" required>
      </div>
      <div class="field">
        <label>Nomor WhatsApp / Telepon Aktif <span class="req">*</span></label>
        <input type="tel" name="whatsapp" placeholder="08xxxxxxxxxx" required>
        <div class="hint">Pastikan nomor terhubung dengan WhatsApp aktif.</div>
      </div>
      <div class="field">
        <label>Alamat Domisili Saat Ini <span class="req">*</span></label>
        <textarea name="alamat" placeholder="Tuliskan alamat lengkap mencakup Kecamatan dan Kabupaten/Kota" required></textarea>
      </div>
      <div class="field">
        <label>Wilayah Kerja Home Visit yang Dipilih <span class="req">*</span></label>
        <div class="choice-group row">
          <label class="choice-item"><input type="checkbox" name="wilayah_kerja" value="Kabupaten Asahan"> Kabupaten Asahan</label>
          <label class="choice-item"><input type="checkbox" name="wilayah_kerja" value="Kota Tanjungbalai"> Kota Tanjungbalai</label>
          <label class="choice-item"><input type="checkbox" name="wilayah_kerja" value="Kabupaten Batu Bara"> Kabupaten Batu Bara</label>
        </div>
      </div>
    `;

    case "akademik": return `
      <h3>Bagian 2 — Riwayat Pendidikan &amp; Status Akademik</h3>
      <p class="step-desc">Bantu kami memastikan kamu memenuhi syarat minimal tiap kelas.</p>
      <div class="field">
        <label>Status Pendidikan / Pekerjaan Saat Ini <span class="req">*</span></label>
        <div class="choice-group">
          <label class="choice-item"><input type="radio" name="status_akademik" value="Mahasiswa Aktif" required> Mahasiswa Aktif</label>
          <label class="choice-item"><input type="radio" name="status_akademik" value="Lulusan/Alumni"> Lulusan / Alumni</label>
          <label class="choice-item"><input type="radio" name="status_akademik" value="Santri/Pelajar"> Santri / Pelajar</label>
        </div>
      </div>
      <div class="field">
        <label>Nama Perguruan Tinggi / MA / Pesantren <span class="req">*</span></label>
        <input type="text" name="institusi" placeholder="cth. Universitas Royal / MA Fathul Muin" required>
      </div>
      <div class="field">
        <label>Program Studi / Jurusan <span class="req">*</span></label>
        <input type="text" name="jurusan" placeholder="cth. Sistem Informasi" required>
      </div>
      <div class="field">
        <label>Semester Saat Ini <span class="opt">(khusus mahasiswa)</span></label>
        <select name="semester">
          <option value="">— Pilih semester —</option>
          ${[2,3,4,5,6,7,8].map(n => `<option value="Semester ${n}">Semester ${n}</option>`).join('')}
        </select>
      </div>
    `;

    case "program": return `
      <h3>Bagian 3 — Pilihan Program Kelas &amp; Jenjang Mengajar</h3>
      <p class="step-desc">Pilih kategori kelas yang kamu lamar. Kategori sudah otomatis tercentang sesuai lowongan yang kamu klik.</p>
      <div class="field">
        <label>Kategori Program Mengajar yang Dilamar <span class="req">*</span></label>
        <div class="choice-group">

          <label class="choice-item"><input type="checkbox" name="kategori_program" value="KMPU" data-target="sub-kmpu"> Kelas Mata Pelajaran Umum (KMPU)</label>
          <div class="subgroup" id="sub-kmpu">
            <div class="subtitle">Jenjang Mengajar KMPU</div>
            <div class="choice-group row">
              <label class="choice-item"><input type="checkbox" name="jenjang_kmpu" value="TK (Calistung)"> TK (Calistung)</label>
              <label class="choice-item"><input type="checkbox" name="jenjang_kmpu" value="SD (Mata Pelajaran Umum)"> SD</label>
              <label class="choice-item"><input type="checkbox" name="jenjang_kmpu" value="SMP (Mata Pelajaran Umum)"> SMP</label>
              <label class="choice-item"><input type="checkbox" name="jenjang_kmpu" value="SMA (Mata Pelajaran Umum)"> SMA</label>
            </div>
          </div>

          <label class="choice-item"><input type="checkbox" name="kategori_program" value="KMPI" data-target="sub-kmpi"> Kelas Mengaji dan Pendidikan Islam (KMPI)</label>
          <div class="subgroup" id="sub-kmpi">
            <div class="subtitle">Jenjang Mengajar KMPI</div>
            <div class="choice-group row">
              <label class="choice-item"><input type="checkbox" name="jenjang_kmpi" value="Anak-Remaja (Iqro, Al-Qur'an, Tahsin, Tahfidz, Tajwid, Ibadah & Syariat)"> Anak – Remaja</label>
              <label class="choice-item"><input type="checkbox" name="jenjang_kmpi" value="Dewasa (Iqro, Al-Qur'an, Tahsin, Tahfidz, Tajwid, Ibadah & Syariat)"> Dewasa</label>
            </div>
          </div>

          <label class="choice-item"><input type="checkbox" name="kategori_program" value="KBI" data-target="sub-kbi"> Kelas Bahasa Inggris (KBI)</label>
          <div class="subgroup" id="sub-kbi">
            <div class="subtitle">Jenjang Mengajar KBI</div>
            <div class="choice-group row">
              <label class="choice-item"><input type="checkbox" name="jenjang_kbi" value="SD (Grammar, Conversation, Writing)"> SD</label>
              <label class="choice-item"><input type="checkbox" name="jenjang_kbi" value="SMP (Grammar, Conversation, Writing)"> SMP</label>
              <label class="choice-item"><input type="checkbox" name="jenjang_kbi" value="SMA (Grammar, Conversation, Writing)"> SMA</label>
            </div>
          </div>

        </div>
      </div>
    `;

    case "kualifikasi": return `
      <h3>Bagian 4 — Kualifikasi Khusus &amp; Pengalaman</h3>
      <p class="step-desc">Ceritakan pengalaman relevan — jadi nilai tambah saat seleksi.</p>
      <div class="field">
        <label>Pengalaman Mengajar (Formal maupun Non-Formal) <span class="req">*</span></label>
        <textarea name="pengalaman_mengajar" placeholder="Jelaskan riwayat mengajar Anda (nama lembaga, sekolah, atau bimbel/privat sebelumnya dan durasinya)" required></textarea>
      </div>
      <div class="field">
        <label>Sertifikat Tahfidz / Lomba / Keahlian Khusus Keislaman <span class="opt">(opsional)</span></label>
        <textarea name="sertifikat_islam" placeholder="Sebutkan hafalan Al-Qur'an (jumlah juz), sertifikat tahsin/tahfidz, atau pengalaman lomba keislaman jika ada"></textarea>
      </div>
      <div class="field">
        <label>Sertifikat Kelulusan Kursus Bahasa Inggris <span class="opt">(opsional)</span></label>
        <input type="text" name="sertifikat_inggris" placeholder="Nama lembaga penyelenggara kursus dan tingkat kelulusan">
      </div>
    `;

    case "operasional": return `
      <h3>Bagian 5 — Kesiapan Operasional &amp; Komitmen</h3>
      <p class="step-desc">Langkah terakhir sebelum kirim pendaftaran.</p>
      <div class="field">
        <label>Kepemilikan Transportasi Pribadi <span class="req">*</span></label>
        <div class="choice-group">
          <label class="choice-item"><input type="radio" name="transportasi" value="Ya (Sepeda Motor/Kendaraan Pribadi)" required> Ya (Sepeda Motor / Kendaraan Pribadi)</label>
          <label class="choice-item"><input type="radio" name="transportasi" value="Tidak"> Tidak</label>
        </div>
      </div>
      <div class="field">
        <label>Ketersediaan Waktu Mengajar <span class="req">*</span></label>
        <div class="choice-group row">
          <label class="choice-item"><input type="checkbox" name="ketersediaan" value="Senin-Kamis (Sore/Malam)"> Senin–Kamis (Sore/Malam)</label>
          <label class="choice-item"><input type="checkbox" name="ketersediaan" value="Jumat-Minggu (Sore/Malam)"> Jumat–Minggu (Sore/Malam)</label>
          <label class="choice-item"><input type="checkbox" name="ketersediaan" value="Fleksibel"> Fleksibel</label>
        </div>
      </div>
      <div class="field">
        <label>Pernyataan Integritas &amp; Komitmen <span class="req">*</span></label>
        <select name="pernyataan_integritas" required>
          <option value="">— Pilih pernyataan —</option>
          <option value="Setuju">Saya bersedia mengajar dengan jujur, komunikatif, dan tepat waktu sesuai tata tertib Bimbel Madani.</option>
        </select>
      </div>
      <div class="field">
        <label>Unggah Berkas Persyaratan <span class="req">*</span></label>
        <div class="upload-box" id="upload-box">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/></svg>
          <div class="up-title">Klik untuk unggah berkas</div>
          <div class="up-sub">CV, KTP, Transkrip/Ijazah, Sertifikat Pendukung — PDF/JPG/PNG, maks 10MB/file</div>
        </div>
        <input type="file" id="file-input" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none">
        <div class="file-list" id="file-list"></div>
      </div>
    `;
  }
}

/* ===== Render step + nav ===== */
function renderStep() {
  renderStepper();
  document.getElementById("step-container").innerHTML = stepTemplate(currentStep) + navTemplate();
  attachStepBehaviors();
  restoreFieldValues();

  // Prefill kategori program dari query ?posisi= hanya saat pertama kali sampai di Bagian 3
  if (STEPS[currentStep].key === "program" && !formData._posisiApplied) {
    const kategori = getPosisiFromQuery();
    if (kategori) {
      const cb = document.querySelector(`input[name="kategori_program"][value="${kategori}"]`);
      if (cb) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
        formData.kategori_program = [kategori];
      }
    }
    formData._posisiApplied = true;
  }

  attachNavHandlers();
}

function navTemplate() {
  return `
    <div class="form-nav">
      <button type="button" class="btn btn-ghost" id="btn-prev" ${currentStep === 0 ? 'hidden' : ''}>← Sebelumnya</button>
      <button type="button" class="btn btn-next" id="btn-next">
        ${currentStep === STEPS.length - 1 ? 'Kirim Pendaftaran' : 'Lanjut →'}
      </button>
    </div>
  `;
}

/* ===== Behaviors (subgroup toggle, upload) ===== */
function syncChoiceHighlight(input) {
  const item = input.closest('.choice-item');
  if (!item) return;
  if (input.type === 'radio') {
    // uncheck highlight on sibling radios in the same group
    document.querySelectorAll(`input[name="${input.name}"]`).forEach(r => {
      const label = r.closest('.choice-item');
      if (label) label.classList.toggle('is-checked', r.checked);
    });
  } else {
    item.classList.toggle('is-checked', input.checked);
  }
}

function attachStepBehaviors() {
  // highlight state untuk semua checkbox & radio di dalam .choice-item
  document.querySelectorAll('.choice-item input[type="checkbox"], .choice-item input[type="radio"]').forEach(input => {
    syncChoiceHighlight(input);
    input.addEventListener('change', () => syncChoiceHighlight(input));
  });

  document.querySelectorAll('[data-target]').forEach(cb => {
    cb.addEventListener('change', () => {
      const target = document.getElementById(cb.getAttribute('data-target'));
      if (target) target.classList.toggle('show', cb.checked);
    });
  });

  const box = document.getElementById('upload-box');
  const input = document.getElementById('file-input');
  if (box && input) {
    box.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      Array.from(input.files).forEach(readFileAsBase64_);
    });
  }
  renderFileList();
}

function readFileAsBase64_(file) {
  if (file.size > 10 * 1024 * 1024) {
    alert(`File "${file.name}" lebih dari 10MB, tidak diunggah.`);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result.split(',')[1]; // buang prefix "data:mime;base64,"
    formData.berkas.push({ name: file.name, mimeType: file.type, data: base64 });
    renderFileList();
  };
  reader.onerror = () => alert(`Gagal membaca file "${file.name}".`);
  reader.readAsDataURL(file);
}

function renderFileList() {
  const list = document.getElementById('file-list');
  if (!list) return;
  list.innerHTML = formData.berkas.map((file, i) => `
    <div class="file-chip"><span>📎 ${file.name}</span> <button type="button" data-remove="${i}">✕</button></div>
  `).join('');
  list.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      formData.berkas.splice(Number(btn.getAttribute('data-remove')), 1);
      renderFileList();
    });
  });
}

/* ===== Data collect / restore ===== */
function collectStepValues() {
  const container = document.getElementById("step-container");
  container.querySelectorAll('input, select, textarea').forEach(field => {
    if (field.type === 'file') return;
    if (field.type === 'checkbox') {
      formData[field.name] = formData[field.name] || [];
      if (field.checked && !formData[field.name].includes(field.value)) {
        formData[field.name].push(field.value);
      } else if (!field.checked) {
        formData[field.name] = formData[field.name].filter(v => v !== field.value);
      }
    } else if (field.type === 'radio') {
      if (field.checked) formData[field.name] = field.value;
    } else {
      formData[field.name] = field.value;
    }
  });
}

function restoreFieldValues() {
  const container = document.getElementById("step-container");
  container.querySelectorAll('input, select, textarea').forEach(field => {
    if (field.type === 'file') return;
    const saved = formData[field.name];
    if (saved === undefined) return;
    if (field.type === 'checkbox') {
      field.checked = Array.isArray(saved) && saved.includes(field.value);
      if (field.checked) field.dispatchEvent(new Event('change'));
    } else if (field.type === 'radio') {
      field.checked = saved === field.value;
      if (field.checked) syncChoiceHighlight(field);
    } else {
      field.value = saved;
    }
  });
}

/* ===== Validation ===== */
function validateStep() {
  const container = document.getElementById("step-container");
  const required = container.querySelectorAll('[required]');
  let valid = true;
  for (const field of required) {
    if (field.type === 'radio') {
      const group = container.querySelectorAll(`input[name="${field.name}"]`);
      if (![...group].some(r => r.checked)) { flash(field); valid = false; break; }
    } else if (!field.value) {
      flash(field); valid = false; break;
    }
  }
  return valid;
}

function flash(field) {
  field.classList.add('field-error');
  if (field.focus) field.focus();
  setTimeout(() => field.classList.remove('field-error'), 1500);
}

/* ===== Navigation ===== */
function attachNavHandlers() {
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');

  if (prev) prev.addEventListener('click', () => {
    collectStepValues();
    currentStep--;
    renderStep();
    document.querySelector('.form-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (next) next.addEventListener('click', () => {
    if (!validateStep()) return;
    collectStepValues();
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderStep();
      document.querySelector('.form-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      submitForm();
    }
  });
}

/* ===== Submit ===== */
function submitForm() {
  // Ganti URL di bawah dengan Web App URL Google Apps Script kamu
  // (lihat SETUP-BACKEND.md untuk cara deploy)
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyEqZzIFiQ60-EklBabAc_7PiMB3dad6A6I-gH9UtN2vHIXjbIhTCanaB23DYknnwUP/exec";

  formData.posisi_dilamar = getPosisiFromQuery() || (formData.kategori_program || []).join(', ') || '-';

  const submitBtn = document.getElementById('btn-next');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Mengirim...'; }

  const finish = () => {
    document.getElementById("step-container").style.display = "none";
    document.getElementById("success-panel").classList.add("show");

    const kategoriTerpilih = (formData.kategori_program || []).join(', ') || '-';
    const waMessage = encodeURIComponent(
      `Halo Admin Madani Karir, saya ${formData.nama_lengkap || '-'} baru saja mendaftar sebagai tentor (${kategoriTerpilih}). Mohon info proses selanjutnya ya. Terima kasih.`
    );
    document.getElementById("wa-confirm").href = `https://wa.me/6288201524358?text=${waMessage}`;
  };

  if (GAS_URL === "GANTI_DENGAN_URL_APPS_SCRIPT") {
    console.warn("GAS_URL belum diisi — data belum terkirim ke backend. Lihat SETUP-BACKEND.md.");
    console.log("Data formulir:", formData);
    finish();
    return;
  }

  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "text/plain;charset=utf-8" }
  })
    .then(res => res.json())
    .then(res => {
      if (res.status !== "success") console.error("Apps Script error:", res.message);
      finish();
    })
    .catch(err => {
      console.error("Gagal kirim ke Apps Script:", err);
      alert("Gagal mengirim pendaftaran. Cek koneksi internet dan coba lagi.");
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirim Pendaftaran'; }
    });
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", renderStep);