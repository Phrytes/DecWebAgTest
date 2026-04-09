/**
 * PeerJSTransport — browser P2P via WebRTC DataChannels + PeerJS signaling.
 *
 * For use in browser environments (HTTPS compatible).
 * For Node.js / Electron, NknTransport or a direct WebSocket transport is preferred.
 *
 * Requires PeerJS to be loaded: https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js
 */
import { Transport } from './Transport.js';

const DEFAULT_ICE = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export class PeerJSTransport extends Transport {
  constructor(options = {}) {
    super();
    this._options      = options;
    this._peer         = null;
    this._address      = null;
    this._connections  = new Map();   // peerId -> DataConnection
    this._messageHandler = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      // Peer is available globally in browser, or via require('peerjs') in Node
      const PeerClass = typeof Peer !== 'undefined' ? Peer : require('peerjs').Peer;

      this._peer = new PeerClass({
        ...this._options,
        config: { iceServers: this._options.iceServers ?? DEFAULT_ICE },
      });

      this._peer.on('open',       (id)   => { this._address = id; resolve(); });
      this._peer.on('error',      (err)  => reject(err));
      this._peer.on('connection', (conn) => this._wire(conn));
    });
  }

  async send(address, message) {
    let conn = this._connections.get(address);

    if (!conn || !conn.open) {
      conn = await this._dial(address);
    }

    const raw = typeof message === 'string' ? message : JSON.stringify(message);
    conn.send(raw);
  }

  onMessage(handler) {
    this._messageHandler = handler;
  }

  async disconnect() {
    this._peer?.destroy();
    this._peer       = null;
    this._address    = null;
    this._connections.clear();
  }

  get localAddress() {
    return this._address;
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  _wire(conn) {
    this._connections.set(conn.peer, conn);

    conn.on('data',  (data) => {
      if (this._messageHandler) {
        this._messageHandler(conn.peer, typeof data === 'string' ? data : JSON.stringify(data));
      }
    });
    conn.on('close', () => this._connections.delete(conn.peer));
    conn.on('error', () => this._connections.delete(conn.peer));

    return conn;
  }

  _dial(peerId) {
    return new Promise((resolve, reject) => {
      const conn = this._peer.connect(peerId, { reliable: true, serialization: 'json' });
      const timer = setTimeout(() => reject(new Error(`Connect to ${peerId} timed out`)), 15_000);
      conn.on('open',  () => { clearTimeout(timer); resolve(this._wire(conn)); });
      conn.on('error', (e) => { clearTimeout(timer); reject(e); });
    });
  }
}
