// Helper function for API calls
async function apiCall(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
    }
    return response.json();
}

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/admin/api/upload/', {
        method: 'POST',
        body: formData
    });
    
    if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
    }
    return response.json();
}
