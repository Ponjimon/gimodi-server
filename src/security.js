import { resolve, sep } from 'node:path';
import state from './state.js';

/**
 * @param {string|string[]|undefined} value
 * @returns {string|null}
 */
export function getHeaderValue(value) {
  if (Array.isArray(value)) return value[0] ?? null;
  return typeof value === 'string' ? value : null;
}

/**
 * @param {import('node:http').IncomingMessage | import('node:http2').Http2ServerRequest} req
 * @returns {string}
 */
export function getRequestIp(req) {
  return req.socket.remoteAddress || '';
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {string} [requiredPermission]
 * @returns {object|null}
 */
export function getAuthenticatedClient(req, requiredPermission) {
  const clientId = getHeaderValue(req.headers['x-client-id']);
  const clientToken = getHeaderValue(req.headers['x-client-token']);
  if (!clientId || !clientToken) return null;

  const client = state.clients.get(clientId);
  if (!client || client.httpAuthToken !== clientToken) return null;

  const requestIp = getRequestIp(req);
  if (client.ip && requestIp && client.ip !== requestIp) return null;

  if (requiredPermission && !client.permissions.has(requiredPermission)) return null;
  return client;
}

/**
 * @param {string} basePath
 * @param {...string} segments
 * @returns {string|null}
 */
export function resolvePathInBase(basePath, ...segments) {
  const base = resolve(basePath);
  const target = resolve(base, ...segments);
  if (target === base || target.startsWith(`${base}${sep}`)) {
    return target;
  }
  return null;
}
