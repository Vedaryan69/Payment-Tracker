const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getLoggedInUser() {
    return sessionStorage.getItem('loggedInUser');
}

function getClients() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return [];
    const clients = localStorage.getItem(`clients_${loggedInUser}`);
    return clients ? JSON.parse(clients) : [];
}

function saveClients(clients) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;
    localStorage.setItem(`clients_${loggedInUser}`, JSON.stringify(clients));
}

function addClient() {
    const name = document.getElementById('clientName').value.trim();
    const contact = document.getElementById('clientContact').value.trim();
    if (!name) return alert('Client Name and Contact Info are required.');

    const clients = getClients();
    const newClientId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;

    const monthStatus = {};
    months.forEach(m => monthStatus[m] = { status: 'Not Paid', note: '' });

    clients.push({ id: newClientId, name, contact, payments: monthStatus });
    saveClients(clients);
    renderClients();

    document.getElementById('clientName').value = '';
    document.getElementById('clientContact').value = '';
}

function renderClients() {
    const container = document.getElementById('clientCards');
    if (!container) return; // Ensure we are on the correct page

    container.innerHTML = '';
    const clients = getClients();

    if (clients.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">No clients added yet. Add a new client above!</p>';
        return;
    }

    clients.forEach(client => {
        container.innerHTML += `
          <div class="bg-white rounded-xl p-4 shadow cursor-pointer" onclick="window.location.href='client_details.html?id=${client.id}'">
            <div class="flex justify-between mb-2">
              <div>
                <h3 class="text-lg font-semibold">${client.name}</h3>
                <p class="text-sm text-gray-600">${client.contact}</p>
              </div>
              <button onclick="event.stopPropagation(); deleteClient(${client.id});" class="text-red-500 hover:underline">Delete</button>
            </div>
          </div>`;
    });
}

function deleteClient(id) {
    let clients = getClients();
    clients = clients.filter(client => client.id !== id);
    saveClients(clients);
    renderClients();
}

function renderClientDetails() {
    const clientDetailName = document.getElementById('client-detail-name');
    const paymentRecordsContainer = document.getElementById('paymentRecordsContainer');
    if (!clientDetailName || !paymentRecordsContainer) return; // Ensure we are on the correct page

    const urlParams = new URLSearchParams(window.location.search);
    const clientId = parseInt(urlParams.get('id'));
    const clients = getClients();
    const client = clients.find(c => c.id === clientId);

    if (client) {
        clientDetailName.textContent = `Details for ${client.name}`;
        let monthTable = '<table class="w-full border text-sm"><thead><tr class="bg-gray-100"><th class="p-1 border">Month</th><th class="p-1 border">Status</th><th class="p-1 border">Note</th></tr></thead><tbody>';
        months.forEach(month => {
            const payment = client.payments[month];
            monthTable += `
            <tr>
              <td class="border p-1">${month}</td>
              <td class="border p-1">
                <select onchange="updatePaymentStatus(${client.id}, '${month}', this.value)" class="p-1 border rounded">
                  <option value="Paid" ${payment.status === 'Paid' ? 'selected' : ''}>Paid</option>
                  <option value="Promised" ${payment.status === 'Promised' ? 'selected' : ''}>Promised</option>
                  <option value="Not Paid" ${payment.status === 'Not Paid' ? 'selected' : ''}>Not Paid</option>
                </select>
              </td>
              <td class="border p-1">
                <input type="text" value="${payment.note}" onchange="updatePaymentNote(${client.id}, '${month}', this.value)" class="w-full p-1 border">
              </td>
            </tr>`;
        });
        monthTable += '</tbody></table>';
        paymentRecordsContainer.innerHTML = monthTable;
    } else {
        clientDetailName.textContent = 'Client Not Found';
        paymentRecordsContainer.innerHTML = '<p class="text-center text-red-500">The requested client could not be found.</p>';
    }
}

function updatePaymentStatus(clientId, month, status) {
    const clients = getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
        clients[clientIndex].payments[month].status = status;
        saveClients(clients);
    }
}

function updatePaymentNote(clientId, month, note) {
    const clients = getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
        clients[clientIndex].payments[month].note = note;
        saveClients(clients);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('clientCards')) {
        renderClients();
    } else if (document.getElementById('client-detail-name')) {
        renderClientDetails();
    }
});