function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function signup() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        return alert('Username and password are required.');
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return alert('Username already exists.');
    }

    users.push({ username, password });
    saveUsers(users);
    alert('Sign up successful! Please log in.');
    window.location.href = 'login.html';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        return alert('Username and password are required.');
    }

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        sessionStorage.setItem('loggedInUser', username);
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password.');
    }
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

function checkAuth() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser && !window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('signup.html')) {
        window.location.href = 'login.html';
    }
}

// Run checkAuth on every page load
document.addEventListener('DOMContentLoaded', checkAuth);
