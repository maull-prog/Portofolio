/* ================================================
   ADMIN - EXPERIENCE JS
   ================================================ */
document.addEventListener('DOMContentLoaded', loadExperiences);

// Store data globally for editExp to access full deskripsi safely
let expData = [];

async function loadExperiences() {
    const res = await apiCall('/admin/api/experiences/');
    const tbody = document.querySelector('#expTable tbody');
    tbody.innerHTML = '';

    if (res && res.data) {
        expData = res.data;
        const count = res.data.length;
        const badge = document.getElementById('expCount');
        if (badge) badge.textContent = `${count} Pengalaman`;

        res.data.forEach((exp, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${idx + 1}</td>
                <td style="font-weight:600; color:var(--text-primary);">${exp.posisi}</td>
                <td>${exp.perusahaan}</td>
                <td>
                    ${exp.durasi ? `<span class="badge badge-purple">${exp.durasi}</span>` : '—'}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-secondary btn-sm" onclick="editExp(${exp.id})">
                            <i class="fas fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteExp(${exp.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

document.getElementById('expForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('exp_id').value;
    const data = {
        posisi: document.getElementById('posisi').value,
        perusahaan: document.getElementById('perusahaan').value,
        durasi: document.getElementById('durasi').value,
        deskripsi: document.getElementById('deskripsi').value
    };

    let url = '/admin/api/experiences/';
    let method = 'POST';
    if (id) {
        url += id;
        method = 'PUT';
    }

    const res = await apiCall(url, method, data);
    if (res) {
        showToast(res.message || (id ? 'Pengalaman diperbarui!' : 'Pengalaman ditambahkan!'), 'success');
    }
    resetForm();
    loadExperiences();
});

function editExp(id) {
    const exp = expData.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('exp_id').value = exp.id;
    document.getElementById('posisi').value = exp.posisi || '';
    document.getElementById('perusahaan').value = exp.perusahaan || '';
    document.getElementById('durasi').value = exp.durasi || '';
    document.getElementById('deskripsi').value = exp.deskripsi || '';
    document.getElementById('resetBtn').style.display = 'inline-flex';
    document.getElementById('formTitle').textContent = 'Edit Pengalaman';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('expForm').reset();
    document.getElementById('exp_id').value = '';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Tambah Pengalaman Baru';
}

document.getElementById('resetBtn').addEventListener('click', resetForm);

async function deleteExp(id) {
    const ok = await confirmDelete('Yakin ingin menghapus pengalaman kerja ini?');
    if (!ok) return;

    const res = await apiCall(`/admin/api/experiences/${id}`, 'DELETE');
    showToast(res?.message || 'Pengalaman dihapus.', 'success');
    loadExperiences();
}
