class ConnectionManager {
  constructor() {
    this.conn = null;
  }

  connect(address) {
    this.conn = new WebSocket(address);

    this.conn.addEventListener('open', () => {
      console.log('Connection estabished');
      this.initSession();
    });

    this.conn.addEventListener('message', (event) => {
      console.log(`Received message ${event.data}`);
      this.receive(event.data);
    });
  }

  initSession() {
    const sessionId = window.location.hash.split('#')[1];
    if (sessionId) {
      this.send({
        type: 'join-session',
        id: sessionId,
      });
    } else {
      this.send({
        type: 'create-session'
      });
    }
  }

  receive(msg) {
    const data = JSON.parse(msg);
    if (data.type === 'session-created') {
      window.location.hash = data.id;
    }
  }

  send(data) {
    const msg = JSON.stringify(data);
    console.log(`Sendng message ${msg}`);
    this.conn.send(msg);
  }
}