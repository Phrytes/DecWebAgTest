import nkn from 'nkn-sdk';
import { Transport } from './Transport.js';

export class NknTransport extends Transport {
  constructor(options = {}) {
    super();
    this._options = options;
    this._client = null;
    this._messageHandler = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this._client = new nkn.Client(this._options);

      this._client.on('connect', () => resolve());
      this._client.on('error', reject);

      this._client.on('message', (msg) => {
        if (this._messageHandler) {
          this._messageHandler(msg.src, msg.payload.toString());
        }
      });
    });
  }

  async send(address, message) {
    const raw = typeof message === 'string' ? message : JSON.stringify(message);
    await this._client.send(address, raw);
  }

  onMessage(handler) {
    this._messageHandler = handler;
  }

  async disconnect() {
    this._client?.close();
    this._client = null;
  }

  get localAddress() {
    return this._client?.addr ?? null;
  }
}
