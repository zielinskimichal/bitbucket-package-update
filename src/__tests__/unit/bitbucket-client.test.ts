import axios from 'axios';
import { BitBucketClient } from '../../utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BitBucketClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.create.mockReturnValue(mockedAxios as any);
  });

  describe('constructor', () => {
    it('should create instance with correct configuration', () => {
      new BitBucketClient();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.bitbucket.org/2.0',
        headers: {
          Authorization: expect.stringMatching(/^Basic .+$/),
          'Content-Type': 'application/json',
        },
      });
    });

    it('should throw error if credentials are missing', () => {
      const originalUsername = process.env.BITBUCKET_USERNAME;
      process.env.BITBUCKET_USERNAME = '';

      expect(() => new BitBucketClient()).toThrow(
        'BitBucket credentials not found in environment variables',
      );

      process.env.BITBUCKET_USERNAME = originalUsername;
    });
  });

  describe('get', () => {
    it('should make GET request with correct path', async () => {
      const client = new BitBucketClient();
      const mockResponse = { data: { id: 1 } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('/test-path');

      expect(mockedAxios.get).toHaveBeenCalledWith('/test-path');
      expect(result).toBe(mockResponse.data);
    });
  });

  describe('post', () => {
    it('should make POST request with correct path and data', async () => {
      const client = new BitBucketClient();
      const mockResponse = { data: { id: 1 } };
      const postData = { test: 'data' };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await client.post('/test-path', postData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/test-path',
        postData,
        undefined,
      );
      expect(result).toBe(mockResponse.data);
    });
  });
});
