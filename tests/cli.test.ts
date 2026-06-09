import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import the parseArgs function directly
import { parseArgs } from '../src/cli.js';

describe('parseArgs', () => {
  beforeEach(() => {
    // Clear env vars relevant to tempus
    delete process.env.TOGGL_API_TOKEN;
    delete process.env.TOGGL_DEFAULT_WORKSPACE_ID;
    delete process.env.TOGGL_BASE_URL;
  });

  afterEach(() => {
    delete process.env.TOGGL_API_TOKEN;
    delete process.env.TOGGL_DEFAULT_WORKSPACE_ID;
    delete process.env.TOGGL_BASE_URL;
  });

  it('should set TOGGL_API_TOKEN from --token arg', () => {
    parseArgs(['--token', 'cli-token-456']);
    expect(process.env.TOGGL_API_TOKEN).toBe('cli-token-456');
  });

  it('should set TOGGL_DEFAULT_WORKSPACE_ID from --workspace-id arg', () => {
    parseArgs(['--token', 'x', '--workspace-id', '98765']);
    expect(process.env.TOGGL_DEFAULT_WORKSPACE_ID).toBe('98765');
  });

  it('should set TOGGL_BASE_URL from --base-url arg', () => {
    parseArgs(['--token', 'x', '--base-url', 'https://custom.api.com']);
    expect(process.env.TOGGL_BASE_URL).toBe('https://custom.api.com');
  });

  it('should not override existing env var with --token', () => {
    process.env.TOGGL_API_TOKEN = 'existing-token';
    parseArgs(['--token', 'cli-token']);
    expect(process.env.TOGGL_API_TOKEN).toBe('existing-token');
  });

  it('should not override existing env var with --workspace-id', () => {
    process.env.TOGGL_DEFAULT_WORKSPACE_ID = '111';
    parseArgs(['--workspace-id', '222']);
    expect(process.env.TOGGL_DEFAULT_WORKSPACE_ID).toBe('111');
  });

  it('should handle no args gracefully', () => {
    expect(() => parseArgs([])).not.toThrow();
  });

  it('should handle --token without value gracefully', () => {
    expect(() => parseArgs(['--token'])).not.toThrow();
  });
});
