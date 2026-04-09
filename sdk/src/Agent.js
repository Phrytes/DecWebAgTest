import { Task, TaskState } from './protocol/Task.js';

/**
 * An A2A-compliant agent. An app may instantiate several of these.
 *
 * Capabilities (skills) are registered either:
 *   - Programmatically:  agent.register('skill_id', handler, meta)
 *   - Via capability():  the HOF/decorator attaches _capabilityMeta to the
 *                        function; AgentApp scans and calls register() for you.
 */
export class Agent {
  /**
   * @param {object} options
   * @param {Function} [options.acceptancePolicy]
   *   async (fromAddress, task) => true | false | { accepted: bool, reason: string }
   *   Return false (or { accepted: false }) to reject the task before work starts.
   *   Omit to auto-accept all tasks.
   */
  constructor({ id, name, description = '', transport, acceptancePolicy = null }) {
    this.id               = id;
    this.name             = name;
    this.description      = description;
    this.transport        = transport;
    this._acceptancePolicy = acceptancePolicy;

    this._skills     = new Map();   // skillId -> { handler, meta }
    this._pending    = new Map();   // taskId  -> { resolve, reject, timer }
  }

  // ── Capability registration ──────────────────────────────────────────────

  register(skillId, handler, meta = {}) {
    this._skills.set(skillId, { handler, meta: { id: skillId, ...meta } });
    return this;
  }

  // ── A2A Agent Card ───────────────────────────────────────────────────────

  get agentCard() {
    return {
      name:        this.name,
      description: this.description,
      url:         `nkn://${this.transport?.localAddress ?? 'not-connected'}`,
      version:     '1.0',
      capabilities: { streaming: false, pushNotifications: false },
      skills: Array.from(this._skills.values()).map(({ meta }) => ({
        id:          meta.id,
        name:        meta.name        ?? meta.id,
        description: meta.description ?? '',
        inputModes:  meta.inputModes  ?? ['application/json'],
        outputModes: meta.outputModes ?? ['application/json'],
        tags:        meta.tags        ?? [],
      })),
    };
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  async start() {
    await this.transport.connect();
    this.transport.onMessage((from, raw) => this._onMessage(from, raw));
    console.log(`[${this.name}] ready at ${this.transport.localAddress}`);
    return this;
  }

  async stop() {
    await this.transport.disconnect();
  }

  // ── Outbound: invoke a skill on a remote agent ───────────────────────────

  invoke(remoteAddress, skill, params = {}, { timeout = 30_000 } = {}) {
    const task = new Task({ skill, params });

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this._pending.delete(task.id);
        reject(new Error(`Task "${task.id}" timed out after ${timeout}ms`));
      }, timeout);

      this._pending.set(task.id, { resolve, reject, timer });

      this.transport.send(remoteAddress, { type: 'task', task: task.toJSON() });
    });
  }

  // ── Inbound message handling ─────────────────────────────────────────────

  async _onMessage(from, raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'task':              return this._handleIncomingTask(from, msg.task);
      case 'task_update':       return this._handleTaskUpdate(msg.task);
      case 'agent_card_request':
        return this.transport.send(from, { type: 'agent_card_response', card: this.agentCard });
    }
  }

  async _handleIncomingTask(from, taskData) {
    const task   = Task.fromJSON(taskData);
    const entry  = this._skills.get(task.skill);

    const reply = (state, extra = {}) =>
      this.transport.send(from, { type: 'task_update', task: { ...task.toJSON(), state, ...extra } });

    if (!entry) {
      return reply(TaskState.FAILED, { error: `Unknown skill: "${task.skill}"` });
    }

    if (this._acceptancePolicy) {
      const decision = await this._acceptancePolicy(from, task);
      const accepted = typeof decision === 'object' ? decision.accepted : !!decision;
      const reason   = typeof decision === 'object' ? decision.reason   : undefined;
      if (!accepted) {
        return reply(TaskState.REJECTED, { error: reason ?? 'Rejected by agent policy' });
      }
    }

    await reply(TaskState.WORKING);

    try {
      const result = await entry.handler(task.params);
      await reply(TaskState.COMPLETED, { result });
    } catch (err) {
      await reply(TaskState.FAILED, { error: err.message });
    }
  }

  _handleTaskUpdate(taskData) {
    const pending = this._pending.get(taskData.id);
    if (!pending) return;

    if (taskData.state === TaskState.COMPLETED) {
      clearTimeout(pending.timer);
      this._pending.delete(taskData.id);
      pending.resolve(taskData.result);
    } else if (taskData.state === TaskState.FAILED) {
      clearTimeout(pending.timer);
      this._pending.delete(taskData.id);
      pending.reject(new Error(taskData.error));
    } else if (taskData.state === TaskState.REJECTED) {
      clearTimeout(pending.timer);
      this._pending.delete(taskData.id);
      pending.reject(new Error(`Task rejected: ${taskData.error ?? 'no reason given'}`));
    }
    // WORKING state: timer reset handled by caller if needed
  }
}
