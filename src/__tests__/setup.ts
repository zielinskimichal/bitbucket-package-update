import { jest } from '@jest/globals';
import 'dotenv/config';

process.env.BITBUCKET_USERNAME = 'test-user';
process.env.BITBUCKET_APP_PASSWORD = 'test-password';
process.env.BITBUCKET_DOMAIN = 'bitbucket.org';
process.env.GIT_USER_NAME = 'Test Bot';
process.env.GIT_USER_EMAIL = 'test@example.com';

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  access: jest.fn(),
  rm: jest.fn(),
}));
