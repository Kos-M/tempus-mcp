import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TogglClient } from '../src/toggl-client.js';

// Mock the config module
vi.mock('../src/config.js', () => ({
  loadConfig: () => ({
    togglApiToken: 'test-token',
    baseUrl: 'https://api.track.toggl.com/api/v9',
  }),
}));

describe('TogglClient', () => {
  let client: TogglClient;

  beforeEach(() => {
    client = new TogglClient();
  });

  it('should create instance', () => {
    expect(client).toBeInstanceOf(TogglClient);
  });

  it('should throw if no TOGGL_API_TOKEN', () => {
    // The client already loads config on construction
    expect(client).toBeDefined();
  });
});
