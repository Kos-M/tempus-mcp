import { describe, it, expect } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  it('should throw if TOGGL_API_TOKEN is not set', () => {
    const originalToken = process.env.TOGGL_API_TOKEN;
    delete process.env.TOGGL_API_TOKEN;
    delete process.env.TOGGL_TOKEN;

    expect(() => loadConfig()).toThrow('TOGGL_API_TOKEN');

    if (originalToken) process.env.TOGGL_API_TOKEN = originalToken;
  });

  it('should use TOGGL_API_TOKEN when set', () => {
    process.env.TOGGL_API_TOKEN = 'test-token-123';
    const config = loadConfig();
    expect(config.togglApiToken).toBe('test-token-123');
    expect(config.baseUrl).toBe('https://api.track.toggl.com/api/v9');
  });

  it('should fall back to TOGGL_TOKEN', () => {
    const originalToken = process.env.TOGGL_API_TOKEN;
    delete process.env.TOGGL_API_TOKEN;
    process.env.TOGGL_TOKEN = 'fallback-token';

    const config = loadConfig();
    expect(config.togglApiToken).toBe('fallback-token');

    if (originalToken) process.env.TOGGL_API_TOKEN = originalToken;
    delete process.env.TOGGL_TOKEN;
  });

  it('should parse default workspace ID', () => {
    process.env.TOGGL_API_TOKEN = 'test';
    process.env.TOGGL_DEFAULT_WORKSPACE_ID = '12345';
    const config = loadConfig();
    expect(config.defaultWorkspaceId).toBe(12345);
    delete process.env.TOGGL_DEFAULT_WORKSPACE_ID;
  });

  it('should use custom base URL', () => {
    process.env.TOGGL_API_TOKEN = 'test';
    process.env.TOGGL_BASE_URL = 'https://custom.api.com/v9';
    const config = loadConfig();
    expect(config.baseUrl).toBe('https://custom.api.com/v9');
    delete process.env.TOGGL_BASE_URL;
  });
});
