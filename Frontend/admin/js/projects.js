/* ================================================
   ADMIN - PROJECTS JS
   ================================================ */
document.addEventListener('DOMContentLoaded', loadProjects);

let projData = [];

async function loadProjects() {
    const res = await apiCall('/admin/api/projects/');
    const tbody = document.querySelector('#projTable tbody');
    tbody.innerHTML = '';

    if (res && res.data) {
        projData = res.data;
        const count = res.data.length;
        const badge = document.getElementById('projCount');
        if (badge) badge.textContent = `${count} Proyek`;

        res.data.forEach((p, idx) => {
            const imgHtml = p.gambar_url
                ? `<img src="${p.gambar_url}" alt="${p.judul}" style="height:48px; width:72px; object-fit:cover; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">`
                : `<div style="height:48px; width:72px; background:rgba(124,111,205,0.1); border-radius:6px; display:flex; align-items:center; justify-content:center; color:#a78bfa; font-size:16px;"><i class="fas fa-image"></i></div>`;
            const linkHtml = p.link_project
                ? `<a href="${p.link_project}" target="_blank" style="color:#a78bfa; text-decoration:none; font-size:13px;"><i class="fas fa-external-link-alt"></i> Lihat</a>`
                : '<span style="color:var(--text-muted);">—</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${idx + 1}</td>
                <td style="font-weight:600; color:var(--text-primary); max-width:180px;">${p.judul}</td>
                <td>${imgHtml}</td>
                <td>${linkHtml}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-secondary btn-sm" onclick="editProj(${p.id})">
                            <i class="fas fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProj(${p.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Upload gambar
document.getElementById('btnUploadGambar').addEventListener('click', async () => {
    const fileInput = document.getElementById('gambar_upload');
    if (!fileInput.files[0]) {
        showToast('Pilih file gambar terlebih dahulu!', 'error');
        return;
    }

    const btn = document.getElementById('btnUploadGambar');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btn.disabled = true;

    const res = await uploadImage(fileInput.files[0]);
    if (res && res.status === 'success') {
        document.getElementById('gambar_url').value = res.url;
        // Show preview
        const preview = document.getElementById('imgPreview');
        const wrapper = document.getElementById('imgPreviewWrapper');
        if (preview && wrapper) {
            preview.src = res.url;
            wrapper.style.display = 'block';
        }
        showToast('Gambar berhasil diupload!', 'success');
    } else {
        showToast(res?.message || 'Upload gagal. Coba lagi.', 'error');
    }

    btn.innerHTML = '<i class="fas fa-upload"></i> Upload';
    btn.disabled = false;
});

// Show preview when URL is entered manually
document.getElementById('gambar_url').addEventListener('input', function () {
    const url = this.value.trim();
    const preview = document.getElementById('imgPreview');
    const wrapper = document.getElementById('imgPreviewWrapper');
    if (preview && wrapper) {
        if (url) {
            preview.src = url;
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = 'none';
        }
    }
});

document.getElementById('projForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('proj_id').value;
    const data = {
        judul: document.getElementById('judul').value,
        deskripsi: document.getElementById('deskripsi').value,
        gambar_url: document.getElementById('gambar_url').value,
        link_project: document.getElementById('link_project').value
    };

    let url = '/admin/api/projects/';
    let method = 'POST';
    if (id) {
        url += id;
        method = 'PUT';
    }

    const res = await apiCall(url, method, data);
    if (res) {
        showToast(res.message || (id ? 'Proyek diperbarui!' : 'Proyek ditambahkan!'), 'success');
    }
    resetForm();
    loadProjects();
});

function editProj(id) {
    const p = projData.find(x => x.id === id);
    if (!p) return;

    document.getElementById('proj_id').value = p.id;
    document.getElementById('judul').value = p.judul || '';
    document.getElementById('deskripsi').value = p.deskripsi || '';
    document.getElementById('gambar_url').value = p.gambar_url || '';
    document.getElementById('link_project').value = p.link_project || '';

    // Show image preview
    const preview = document.getElementById('imgPreview');
    const wrapper = document.getElementById('imgPreviewWrapper');
    if (preview && wrapper && p.gambar_url) {
        preview.src = p.gambar_url;
        wrapper.style.display = 'block';
    }

    document.getElementById('resetBtn').style.display = 'inline-flex';
    document.getElementById('formTitle').textContent = 'Edit Proyek';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('projForm').reset();
    document.getElementById('proj_id').value = '';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Tambah Proyek Baru';
    const wrapper = document.getElementById('imgPreviewWrapper');
    if (wrapper) wrapper.style.display = 'none';
}

document.getElementById('resetBtn').addEventListener('click', resetForm);

async function deleteProj(id) {
    const ok = await confirmDelete('Yakin ingin menghapus proyek ini? Gambar yang diupload tidak akan terhapus dari Cloudinary.');
    if (!ok) return;

    const res = await apiCall(`/admin/api/projects/${id}`, 'DELETE');
    showToast(res?.message || 'Proyek dihapus.', 'success');
    loadProjects();
}
