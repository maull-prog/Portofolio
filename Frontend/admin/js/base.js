/* ================================================
   ADMIN PANEL - BASE JS
   Global utilities: toast, active nav, sidebar
   ================================================ */

// -------- Toast Notifications --------
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// -------- Active Nav Highlight --------
function setActiveNav() {
    const path = window.location.pathname;
    const navMap = {
        '/admin/dashboard': 'nav-dashboard',
        '/admin/profiles': 'nav-profiles',
        '/admin/skills': 'nav-skills',
        '/admin/experiences': 'nav-experiences',
        '/admin/projects': 'nav-projects',
    };

    // Find the best matching route
    let bestMatch = '';
    let bestMatchId = '';
    for (const [route, id] of Object.entries(navMap)) {
        if (path.startsWith(route) && route.length > bestMatch.length) {
            bestMatch = route;
            bestMatchId = id;
        }
    }

    if (bestMatchId) {
        const el = document.getElementById(bestMatchId);
        if (el) el.classList.add('active');
    }
}

// -------- Custom Confirm Dialog --------
function confirmDelete(message) {
    return new Promise((resolve) => {
        // Create modal
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed; inset:0; background:rgba(0,0,0,0.7); 
            z-index:9998; display:flex; align-items:center; justify-content:center;
            animation: fadeIn 0.2s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: #16161f; border: 1px solid rgba(255,255,255,0.08);
                border-radius: 16px; padding: 28px 32px; max-width: 360px; width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5); text-align: center;
                animation: slideUp 0.25s ease;
            ">
                <div style="
                    width:52px; height:52px; background:rgba(239,68,68,0.15); 
                    border-radius:50%; margin:0 auto 16px; display:flex; 
                    align-items:center; justify-content:center; font-size:22px; color:#f87171;
                ">
                    <i class="fas fa-trash-alt"></i>
                </div>
                <h3 style="font-family:'Space Grotesk',sans-serif; font-size:17px; color:#f0f0f8; margin-bottom:8px;">
                    Konfirmasi Hapus
                </h3>
                <p style="font-size:14px; color:#9090aa; margin-bottom:24px; line-height:1.5;">
                    ${message || 'Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'}
                </p>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button id="confirmCancel" style="
                        padding:9px 20px; background:#1c1c28; border:1px solid rgba(255,255,255,0.08);
                        border-radius:8px; color:#9090aa; font-family:'Plus Jakarta Sans',sans-serif;
                        font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s;
                    ">Batal</button>
                    <button id="confirmOk" style="
                        padding:9px 20px; background:linear-gradient(135deg,#ef4444,#dc2626);
                        border:none; border-radius:8px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
                        font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s;
                        box-shadow: 0 4px 12px rgba(239,68,68,0.3);
                    ">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('confirmOk').addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        document.getElementById('confirmCancel').addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(false);
            }
        });
    });
}

// -------- Init --------
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
});
