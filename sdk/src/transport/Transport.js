/**
 * Base transport interface. Extend this to add new transports
 * (HTTP, WebRTC, Bluetooth, Wi-Fi Direct, etc.).
 *
 * All transports must support:
 *   - connect()              start listening, become addressable
 *   - send(address, msg)     deliver a message to a remote address
 *   - onMessage(handler)     register a handler for incoming messages
 *   - disconnect()           clean shutdown
 *   - localAddress (getter)  this agent's address on this transport
 */
export class Transport {
  async connect() {
    throw new Error(`${this.constructor.name} must implement connect()`);
  }

  async send(address, message) {
    throw new Error(`${this.constructor.name} must implement send()`);
  }

  onMessage(handler) {
    throw new Error(`${this.constructor.name} must implement onMessage()`);
  }

  async disconnect() {
    throw new Error(`${this.constructor.name} must implement disconnect()`);
  }

  get localAddress() {
    throw new Error(`${this.constructor.name} must implement localAddress`);
  }

  get type() {
    return this.constructor.name;
  }
}
