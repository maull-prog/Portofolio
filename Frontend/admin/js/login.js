/* ================================================
   ADMIN - LOGIN JS
   ================================================ */
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    const btn = document.getElementById('loginBtn');

    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Masuk...';
    btn.disabled = true;
    errorMsg.className = '';
    errorMsg.textContent = '';

    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
            setTimeout(() => {
                window.location.href = '/admin/dashboard';
            }, 500);
        } else {
            errorMsg.textContent = result.message || 'Username atau password salah.';
            errorMsg.className = 'show';
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
            btn.disabled = false;
        }
    } catch (err) {
        errorMsg.textContent = 'Terjadi kesalahan jaringan. Coba lagi.';
        errorMsg.className = 'show';
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
        btn.disabled = false;
    }
});

// Hide error on input change
document.getElementById('username').addEventListener('input', clearError);
document.getElementById('password').addEventListener('input', clearError);

function clearError() {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.className = '';
    errorMsg.textContent = '';
}
