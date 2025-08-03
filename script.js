const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let clients = [];

function getClients() {
    const user = auth.currentUser;
    if (!user) return;

    db.collection('users').doc(user.uid).collection('clients').get().then(snapshot => {
        clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderClients();
    });
}

function addClient() {
    const user = auth.currentUser;
    if (!user) return;

    const name = document.getElementById('clientName').value.trim();
    const contact = document.getElementById('clientContact').value.trim();
    if (!name) return alert('Client Name and Contact Info are required.');

    const monthStatus = {};
    months.forEach(m => monthStatus[m] = { status: 'Not Paid', note: '' });

    db.collection('users').doc(user.uid).collection('clients').add({
        name,
        contact,
        payments: monthStatus
    }).then(() => {
        getClients(); // Refresh the list
        document.getElementById('clientName').value = '';
        document.getElementById('clientContact').value = '';
    });
}

function renderClients() {
    const container = document.getElementById('clientCards');
    if (!container) return;

    container.innerHTML = '';
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
              <button onclick="event.stopPropagation(); deleteClient('${client.id}');" class="text-red-500 hover:underline">Delete</button>
            </div>
          </div>`;
    });
}

function deleteClient(id) {
    const user = auth.currentUser;
    if (!user) return;

    db.collection('users').doc(user.uid).collection('clients').doc(id).delete().then(() => {
        getClients(); // Refresh the list
    });
}

function renderClientDetails() {
    const clientDetailName = document.getElementById('client-detail-name');
    const paymentRecordsContainer = document.getElementById('paymentRecordsContainer');
    if (!clientDetailName || !paymentRecordsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');
    const user = auth.currentUser;

    if (user && clientId) {
        db.collection('users').doc(user.uid).collection('clients').doc(clientId).get().then(doc => {
            if (doc.exists) {
                const client = { id: doc.id, ...doc.data() };
                clientDetailName.textContent = `Details for ${client.name}`;
                let monthTable = '<table class="w-full border text-sm"><thead><tr class="bg-gray-100"><th class="p-1 border">Month</th><th class="p-1 border">Status</th><th class="p-1 border">Note</th></tr></thead><tbody>';
                months.forEach(month => {
                    const payment = client.payments[month];
                    monthTable += `
                    <tr>
                      <td class="border p-1">${month}</td>
                      <td class="border p-1">
                        <select onchange="updatePaymentStatus('${client.id}', '${month}', this.value)" class="p-1 border rounded">
                          <option value="Paid" ${payment.status === 'Paid' ? 'selected' : ''}>Paid</option>
                          <option value="Promised" ${payment.status === 'Promised' ? 'selected' : ''}>Promised</option>
                          <option value="Not Paid" ${payment.status === 'Not Paid' ? 'selected' : ''}>Not Paid</option>
                        </select>
                      </td>
                      <td class="border p-1">
                        <input type="text" value="${payment.note}" onchange="updatePaymentNote('${client.id}', '${month}', this.value)" class="w-full p-1 border">
                      </td>
                    </tr>`;
                });
                monthTable += '</tbody></table>';
                paymentRecordsContainer.innerHTML = monthTable;
            } else {
                clientDetailName.textContent = 'Client Not Found';
                paymentRecordsContainer.innerHTML = '<p class="text-center text-red-500">The requested client could not be found.</p>';
            }
        });
    }
}

function updatePaymentStatus(clientId, month, status) {
    const user = auth.currentUser;
    if (!user) return;

    const update = {};
    update[`payments.${month}.status`] = status;
    db.collection('users').doc(user.uid).collection('clients').doc(clientId).update(update);
}

function updatePaymentNote(clientId, month, note) {
    const user = auth.currentUser;
    if (!user) return;

    const update = {};
    update[`payments.${month}.note`] = note;
    db.collection('users').doc(user.uid).collection('clients').doc(clientId).update(update);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            if (document.getElementById('clientCards')) {
                getClients();
            } else if (document.getElementById('client-detail-name')) {
                renderClientDetails();
            }
        }
    });
});