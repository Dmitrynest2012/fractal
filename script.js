let peer;
let conn;

function initPeer() {
    const userId = document.getElementById('userId').value;
    if (!userId) {
        alert('Please enter your ID');
        return;
    }
    peer = new Peer(userId, {
        host: 'peerjs-server.herokuapp.com',
        secure: true,
        port: 443
    });

    peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        document.getElementById('messages').innerHTML += `<div class="message">Your ID: ${id}</div>`;
    });

    peer.on('connection', (connection) => {
        conn = connection;
        conn.on('data', (data) => {
            document.getElementById('messages').innerHTML += `<div class="message">Friend: ${data}</div>`;
        });
        conn.on('open', () => {
            document.getElementById('messages').innerHTML += `<div class="message">Connected to ${conn.peer}</div>`;
        });
    });
}

function connectToPeer() {
    const peerId = document.getElementById('peerId').value;
    if (!peerId) {
        alert('Please enter your friend\'s ID');
        return;
    }
    conn = peer.connect(peerId);
    conn.on('open', () => {
        document.getElementById('messages').innerHTML += `<div class="message">Connected to ${peerId}</div>`;
    });
    conn.on('data', (data) => {
        document.getElementById('messages').innerHTML += `<div class="message">Friend: ${data}</div>`;
    });
}

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (!message || !conn) return;
    conn.send(message);
    document.getElementById('messages').innerHTML += `<div class="message">You: ${message}</div>`;
    document.getElementById('messageInput').value = '';
}