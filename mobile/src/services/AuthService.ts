import { API_CONFIG } from '../config/api';
import { RegisteredRingMember, RingContext } from '../types';

export interface RegisterUserPayload {
  displayName: string;
  publicKey: string;
  identifier?: string;
  escrowedIdentity?: string | null;
}

export interface RegisterUserResponse {
  success: boolean;
  user?: RegisteredRingMember;
  context?: RingContext;
  error?: string;
}

interface AuthApiConfig {
  baseUrl: string;
  timeout?: number;
}

export class AuthService {
  private config: AuthApiConfig;

  constructor(config: Partial<AuthApiConfig> = {}) {
    this.config = {
      baseUrl: API_CONFIG.baseUrl,
      timeout: config.timeout ?? 20000,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data?.error || `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return data as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  registerUser(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
    return this.request<RegisterUserResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  fetchContext(): Promise<{ success: boolean; context: RingContext }> {
    return this.request<{ success: boolean; context: RingContext }>('/api/auth/context');
  }

  listUsers(): Promise<{ success: boolean; users: RegisteredRingMember[] }> {
    return this.request<{ success: boolean; users: RegisteredRingMember[] }>('/api/auth/users');
  }
}
