let peer;
let conn;

function updateStatus(elementId, message, color) {
    const status = document.getElementById(elementId);
    status.textContent = message;
    status.style.color = color;
}

function checkAndInitPeer() {
    const userId = document.getElementById('userId').value.trim();
    if (!userId) {
        updateStatus('userIdStatus', 'Please enter an ID', 'red');
        return;
    }

    peer = new Peer(userId, {
        host: 'peerjs-server.herokuapp.com',
        secure: true,
        port: 443
    });

    peer.on('open', (id) => {
        updateStatus('userIdStatus', 'ID is available! Connected as ' + id, 'green');
        document.getElementById('messages').innerHTML += `<div class="message">Your ID: ${id}</div>`;
    });

    peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
            updateStatus('userIdStatus', 'ID is already taken', 'red');
            peer.destroy();
        } else {
            updateStatus('userIdStatus', 'Error: ' + err, 'red');
        }
    });

    peer.on('connection', (connection) => {
        conn = connection;
        conn.on('data', (data) => {
            document.getElementById('messages').innerHTML += `<div class="message">Friend (${conn.peer}): ${data}</div>`;
        });
        conn.on('open', () => {
            document.getElementById('messages').innerHTML += `<div class="message">Connected to ${conn.peer}</div>`;
        });
    });
}

function checkPeerOnline() {
    const peerId = document.getElementById('peerId').value.trim();
    if (!peerId) {
        updateStatus('peerIdStatus', 'Please enter a friend\'s ID', 'red');
        return;
    }

    if (!peer) {
        updateStatus('peerIdStatus', 'Please connect with your ID first', 'red');
        return;
    }

    updateStatus('peerIdStatus', 'Checking...', 'blue');
    const tempConn = peer.connect(peerId);
    
    tempConn.on('open', () => {
        updateStatus('peerIdStatus', `${peerId} is online!`, 'green');
        conn = tempConn;
        document.getElementById('messages').innerHTML += `<div class="message">Connected to ${peerId}</div>`;
    });

    tempConn.on('error', (err) => {
        updateStatus('peerIdStatus', `${peerId} is offline or unavailable`, 'red');
    });
}

function sendMessage() {
    const message = document.getElementById('messageInput').value.trim();
    if (!message || !conn) {
        updateStatus('peerIdStatus', 'Not connected to a friend', 'red');
        return;
    }
    conn.send(message);
    document.getElementById('messages').innerHTML += `<div class="message">You: ${message}</div>`;
    document.getElementById('messageInput').value = '';
}