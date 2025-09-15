async function handleCallback() {
    console.log('Callback.js: Starting handleCallback');
    console.log('Callback.js: Current URL:', window.location.href);
    console.log('Callback.js: Search params:', window.location.search);
    console.log('Callback.js: Hash:', window.location.hash);
    
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
            console.log('Callback.js: OAuth error detected:', error);
            throw new Error(`OAuth Error: ${error}`);
        }

        if (!code) {
            console.log('Callback.js: No authorization code found');
            throw new Error('Không nhận được mã xác thực từ Google');
        }

        console.log('Callback.js: Starting token exchange');

        // Exchange code for token and user info
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
        const refreshToken = tokenData.refresh_token;
        const expiresIn = tokenData.expires_in || 3600; // Default 1 hour

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to get user info');
        }

        const userData = await userResponse.json();

        const user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            verified_email: userData.verified_email,
        };

        // Store Google access token for backend API to use
        console.log('Callback.js: Storing Google access token');
        localStorage.setItem('muslimviet_google_token', accessToken);
        localStorage.setItem('muslimviet_auth_success', 'true');
        
        console.log('Callback.js: Redirecting to /auth/callback');
        
        // Always redirect to /auth/callback route in React app
        window.location.href = '/auth/callback';

    } catch (error) {
        console.error('Callback.js: Auth callback error:', error);
        
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
            errorDiv.textContent = error.message || 'Đăng nhập thất bại';
            errorDiv.style.display = 'block';
        }
        
        console.log('Callback.js: Storing error in localStorage:', error.message);
        localStorage.setItem('muslimviet_auth_error', error.message || 'Đăng nhập thất bại');
        
        // Redirect to React app even on error
        console.log('Callback.js: Redirecting to /auth/callback after error');
        setTimeout(() => {
            window.location.href = '/auth/callback';
        }, 2000);
    }
}

// Run callback handler when page loads
console.log('Callback.js: Script loaded, adding DOMContentLoaded listener');
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Callback.js: DOM loaded, calling handleCallback');
        handleCallback();
    });
} else {
    handleCallback();
}
