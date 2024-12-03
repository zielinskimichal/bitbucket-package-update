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

    // Add request logging
    this.client.interceptors.request.use((request) => {
      console.log('Making request:', {
        method: request.method?.toUpperCase(),
        url: request.url,
        headers: request.headers,
      });
      return request;
    });

    // Add response logging
    this.client.interceptors.response.use(
      (response) => {
        console.log('Received response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error('Request failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
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
    console.log(`GET ${path}`);
    const response = await this.client.get<T>(path);
    return response.data;
  }

  async post<T>(path: string, data?: unknown, config?: any): Promise<T> {
    console.log(`POST ${path}`, { data });
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    console.log(`PUT ${path}`, { data });
    const response = await this.client.put<T>(path, data);
    return response.data;
  }
}
