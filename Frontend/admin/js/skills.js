/* ================================================
   ADMIN - SKILLS JS
   ================================================ */
document.addEventListener('DOMContentLoaded', loadSkills);

async function loadSkills() {
    const res = await apiCall('/admin/api/skills/');
    const tbody = document.querySelector('#skillsTable tbody');
    tbody.innerHTML = '';

    if (res && res.data) {
        const count = res.data.length;
        const badge = document.getElementById('skillCount');
        if (badge) badge.textContent = `${count} Skill${count !== 1 ? 's' : ''}`;

        res.data.forEach((skill, idx) => {
            const iconClass = skill.icon_class || 'fas fa-code';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${idx + 1}</td>
                <td style="font-weight:600; color:var(--text-primary);">${skill.nama_skill}</td>
                <td><code style="font-size:12px; color:#a78bfa; background:rgba(124,111,205,0.1); padding:2px 8px; border-radius:4px;">${skill.icon_class || '—'}</code></td>
                <td>
                    <i class="${iconClass}" style="font-size:18px; color:#a78bfa;"></i>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-secondary btn-sm" onclick="editSkill(${skill.id}, '${skill.nama_skill}', '${skill.icon_class || ''}')">
                            <i class="fas fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSkill(${skill.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('skill_id').value;
    const data = {
        nama_skill: document.getElementById('nama_skill').value,
        icon_class: document.getElementById('icon_class').value
    };

    let url = '/admin/api/skills/';
    let method = 'POST';
    if (id) {
        url += id;
        method = 'PUT';
    }

    const res = await apiCall(url, method, data);
    if (res) {
        showToast(res.message || (id ? 'Skill diperbarui!' : 'Skill ditambahkan!'), 'success');
    }
    resetForm();
    loadSkills();
});

function editSkill(id, nama, icon) {
    document.getElementById('skill_id').value = id;
    document.getElementById('nama_skill').value = nama;
    document.getElementById('icon_class').value = icon;
    document.getElementById('resetBtn').style.display = 'inline-flex';
    document.getElementById('formTitle').textContent = 'Edit Skill';
    document.querySelector('#skillForm input[id="nama_skill"]').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('skillForm').reset();
    document.getElementById('skill_id').value = '';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Tambah Skill Baru';
}

document.getElementById('resetBtn').addEventListener('click', resetForm);

async function deleteSkill(id) {
    const ok = await confirmDelete('Yakin ingin menghapus skill ini?');
    if (!ok) return;

    const res = await apiCall(`/admin/api/skills/${id}`, 'DELETE');
    showToast(res?.message || 'Skill dihapus.', 'success');
    loadSkills();
}
