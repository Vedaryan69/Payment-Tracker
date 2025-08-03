function signup() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        return alert('Email and password are required.');
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Sign up successful! Please log in.');
            window.location.href = 'login.html';
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
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert(error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
}

function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (!user && !window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('signup.html')) {
            window.location.href = 'login.html';
        }
    });
}

// Run checkAuth on every page load
document.addEventListener('DOMContentLoaded', checkAuth);