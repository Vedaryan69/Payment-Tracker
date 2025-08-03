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

document.addEventListener('DOMContentLoaded', checkAuth);