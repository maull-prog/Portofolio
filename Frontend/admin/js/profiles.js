/* ================================================
   ADMIN - PROFILES JS
   ================================================ */
document.addEventListener('DOMContentLoaded', async () => {
    const res = await apiCall('/admin/api/profiles/');
    if (res && res.data) {
        const d = res.data;
        document.getElementById('nama_lengkap').value = d.nama_lengkap || '';
        document.getElementById('nama_panggilan').value = d.nama_panggilan || '';
        document.getElementById('email').value = d.email || '';
        document.getElementById('telepon').value = d.telepon || '';
        document.getElementById('tempat_lahir').value = d.tempat_lahir || '';
        document.getElementById('tanggal_lahir').value = d.tanggal_lahir || '';
        document.getElementById('universitas').value = d.universitas || '';
        document.getElementById('fakultas').value = d.fakultas || '';
        document.getElementById('prodi').value = d.prodi || '';
        document.getElementById('semester').value = d.semester || '';
        document.getElementById('alamat').value = d.alamat || '';
        document.getElementById('foto_url').value = d.foto_url || '';
        document.getElementById('foto_about_url').value = d.foto_about_url || '';
    }
});

// Upload foto profil
document.getElementById('btnUploadFoto').addEventListener('click', async () => {
    const fileInput = document.getElementById('foto_upload');
    if (!fileInput.files[0]) {
        showToast('Pilih file foto terlebih dahulu!', 'error');
        return;
    }

    const btn = document.getElementById('btnUploadFoto');
    const progress = document.getElementById('uploadProgress');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btn.disabled = true;
    if (progress) progress.style.display = 'flex';

    const res = await uploadImage(fileInput.files[0]);
    if (res && res.status === 'success') {
        document.getElementById('foto_url').value = res.url;
        showToast('Foto berhasil diupload ke Cloudinary!', 'success');
    } else {
        showToast(res?.message || 'Upload gagal. Cek konfigurasi Cloudinary.', 'error');
    }

    btn.innerHTML = '<i class="fas fa-upload"></i> Upload';
    btn.disabled = false;
    if (progress) progress.style.display = 'none';
});

// Upload foto about
document.getElementById('btnUploadFotoAbout').addEventListener('click', async () => {
    const fileInput = document.getElementById('foto_about_upload');
    if (!fileInput.files[0]) {
        showToast('Pilih file foto terlebih dahulu!', 'error');
        return;
    }

    const btn = document.getElementById('btnUploadFotoAbout');
    const progress = document.getElementById('uploadProgressAbout');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btn.disabled = true;
    if (progress) progress.style.display = 'flex';

    const res = await uploadImage(fileInput.files[0]);
    if (res && res.status === 'success') {
        document.getElementById('foto_about_url').value = res.url;
        showToast('Foto About berhasil diupload ke Cloudinary!', 'success');
    } else {
        showToast(res?.message || 'Upload gagal. Cek konfigurasi Cloudinary.', 'error');
    }

    btn.innerHTML = '<i class="fas fa-upload"></i> Upload';
    btn.disabled = false;
    if (progress) progress.style.display = 'none';
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpanProfil');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    const data = {
        nama_lengkap: document.getElementById('nama_lengkap').value,
        nama_panggilan: document.getElementById('nama_panggilan').value,
        email: document.getElementById('email').value,
        telepon: document.getElementById('telepon').value,
        tempat_lahir: document.getElementById('tempat_lahir').value,
        tanggal_lahir: document.getElementById('tanggal_lahir').value,
        universitas: document.getElementById('universitas').value,
        fakultas: document.getElementById('fakultas').value,
        prodi: document.getElementById('prodi').value,
        semester: document.getElementById('semester').value,
        alamat: document.getElementById('alamat').value,
        foto_url: document.getElementById('foto_url').value,
        foto_about_url: document.getElementById('foto_about_url').value
    };

    const res = await apiCall('/admin/api/profiles/', 'POST', data);
    if (res) {
        showToast(res.message || 'Profil berhasil disimpan!', 'success');
    }

    btn.innerHTML = '<i class="fas fa-save"></i> Simpan Profil';
    btn.disabled = false;
});
