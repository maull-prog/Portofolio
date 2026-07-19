/* ================================================
   ADMIN - DASHBOARD JS
   ================================================ */
document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
});

async function loadStats() {
    try {
        const [skillsRes, expRes, projRes] = await Promise.all([
            apiCall('/admin/api/skills/'),
            apiCall('/admin/api/experiences/'),
            apiCall('/admin/api/projects/')
        ]);

        animateCount('statSkills', skillsRes?.data?.length ?? 0);
        animateCount('statExp', expRes?.data?.length ?? 0);
        animateCount('statProjects', projRes?.data?.length ?? 0);
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

function animateCount(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let current = 0;
    const duration = 800;
    const step = target / (duration / 16);

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = Math.floor(current);
    }, 16);
}
