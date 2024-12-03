import axios, { AxiosInstance } from 'axios';

export class BitBucketClient {
  private static instance: BitBucketClient;
  private client: AxiosInstance;

  private constructor() {
    const username = process.env.BITBUCKET_USERNAME;
    const appPassword = process.env.BITBUCKET_APP_PASSWORD;
    const baseUrl =
      process.env.BITBUCKET_API_URL || 'https://api.bitbucket.org/2.0';

    if (!username || !appPassword) {
      throw new Error(
        'BitBucket credentials not found in environment variables',
      );
    }

    const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): BitBucketClient {
    if (!BitBucketClient.instance) {
      BitBucketClient.instance = new BitBucketClient();
    }
    return BitBucketClient.instance;
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.client.get<T>(path);
    return response.data;
  }

  async post<T>(path: string, data?: unknown, config?: any): Promise<T> {
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }
}
