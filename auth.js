function signup() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        return alert('Email and password are required.');
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Sign up successful! Please log in.');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert(error.message);
        });
}

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        return alert('Email and password are required.');
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            alert(error.message);
        });
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            window.location.href = 'dashboard.html';
        }).catch((error) => {
            alert(error.message);
        });
}

function signInWithPhone() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const appVerifier = window.recaptchaVerifier;
    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert('Verification code sent!');
        }).catch((error) => {
            alert("Error: " + error.message);
            grecaptcha.reset(window.recaptchaWidgetId);
        });
}

function verifyCode() {
    const code = document.getElementById('verificationCode').value;
    window.confirmationResult.confirm(code).then((result) => {
        window.location.href = 'dashboard.html';
    }).catch((error) => {
        alert('Invalid verification code');
    });
}


function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('signup.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('signup.html')) {
                window.location.href = 'index.html';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize reCAPTCHA verifier
    if (document.getElementById('recaptcha-container')) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        window.recaptchaVerifier.render().then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
        });
    }
    checkAuth();
});