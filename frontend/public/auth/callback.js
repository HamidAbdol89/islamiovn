async function handleCallback() {
    console.log('Callback.js: Starting handleCallback');
    console.log('Callback.js: Current URL:', window.location.href);

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('Callback.js: URL params:', { 
            code: code ? 'present' : 'missing', 
            error, 
            state,
            allParams: Object.fromEntries(urlParams.entries())
        });

        if (error) {
            console.error('Callback.js: OAuth error detected:', error);
            throw new Error(`OAuth Error: ${error}`);
        }

        if (!code) {
            console.error('Callback.js: No authorization code found');
            throw new Error('Không nhận được mã xác thực từ Google');
        }

        console.log('Callback.js: Starting token exchange');

        // Exchange code for token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: '103550553248-ckf9er52ik68ar6gf4se2v5tb0470gla.apps.googleusercontent.com',
                client_secret: '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',
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `${window.location.origin}/auth/callback`,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error_description || 'Token exchange failed');
        }

        const tokenData = await response.json();
        const accessToken = tokenData.access_token;

        // Store token in localStorage
        localStorage.setItem('muslimviet_google_token', accessToken);
        localStorage.setItem('muslimviet_auth_success', 'true');

        console.log('Callback.js: Token stored. User remains on /auth/callback');

        // Optional: show success message
        const successDiv = document.getElementById('success');
        if (successDiv) {
            successDiv.textContent = 'Đăng nhập thành công!';
            successDiv.style.display = 'block';
        }

    } catch (error) {
        console.error('Callback.js: Auth callback error:', error);
        
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
            errorDiv.textContent = error.message || 'Đăng nhập thất bại';
            errorDiv.style.display = 'block';
        }

        localStorage.setItem('muslimviet_auth_error', error.message || 'Đăng nhập thất bại');
    }
}

// Run callback handler when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleCallback);
} else {
    handleCallback();
}
