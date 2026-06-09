import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    client = new TogglClient();
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 123, wid: 1 }), { status: 200 }),
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should create instance', () => {
    expect(client).toBeInstanceOf(TogglClient);
  });

  it('should include wid in createTimeEntry request body', async () => {
    const workspaceId = 12345;
    await client.createTimeEntry(workspaceId, {
      description: 'Test entry',
      start: '2026-06-09T08:00:00.000Z',
    });

    const callArgs = fetchSpy.mock.calls[0];
    expect(callArgs).toBeDefined();
    const [url, options] = callArgs;
    expect(url).toContain(`/workspaces/${workspaceId}/time_entries`);
    const body = JSON.parse(options?.body as string);
    expect(body.wid).toBe(workspaceId);
  });
});
