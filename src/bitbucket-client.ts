import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class BitBucketClient {
  private client: AxiosInstance;

  constructor() {
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

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const message =
            error.response.data.error ||
            error.response.data.message ||
            'Unknown BitBucket API error';
          throw new Error(
            `BitBucket API Error (${error.response.status}): ${message}`,
          );
        }
        throw error;
      },
    );
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.client.get<T>(path);
    return response.data;
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }
}
