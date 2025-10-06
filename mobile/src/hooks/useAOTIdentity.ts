import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, RegisterUserPayload } from '../services/AuthService';
import { AOTIdentity, RegisteredRingMember, RingContext } from '../types';
import { generateKeyPair, initializeCrypto } from '../utils/aotCrypto';

const STORAGE_KEY = 'aot_identity_v1';

const createRandomIdentifier = () => `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const serializeIdentity = (identity: AOTIdentity) => JSON.stringify(identity);
const deserializeIdentity = (value: string | null): AOTIdentity | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as AOTIdentity;
  } catch (error) {
    return null;
  }
};

export interface UseAOTIdentityResult {
  identity: AOTIdentity | null;
  ringContext: RingContext | null;
  otherMembers: RegisteredRingMember[];
  isLoading: boolean;
  error: string | null;
  ensureIdentity: () => Promise<AOTIdentity>;
  refreshContext: () => Promise<RingContext>;
  clearError: () => void;
}

export const useAOTIdentity = (): UseAOTIdentityResult => {
  const [identity, setIdentity] = useState<AOTIdentity | null>(null);
  const [ringContext, setRingContext] = useState<RingContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authServiceRef = useRef(new AuthService());
  const initializedRef = useRef(false);

  const loadStoredIdentity = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = deserializeIdentity(stored);
      if (parsed) {
        setIdentity(parsed);
      }
    } catch (err) {
      console.warn('Failed to load stored AOT identity:', err);
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeCrypto();
      loadStoredIdentity();
    }
  }, [loadStoredIdentity]);

  const persistIdentity = useCallback(async (value: AOTIdentity) => {
    setIdentity(value);
    await AsyncStorage.setItem(STORAGE_KEY, serializeIdentity(value));
  }, []);

  const registerIdentity = useCallback(
    async (
      payload: RegisterUserPayload,
      draft: AOTIdentity,
    ): Promise<{ identity: AOTIdentity; context: RingContext }> => {
      const response = await authServiceRef.current.registerUser(payload);
      if (!response.success || !response.user) {
        throw new Error(response.error || 'Failed to register identity');
      }

      const updatedIdentity: AOTIdentity = {
        ...draft,
        userId: response.user.userId,
        displayName: response.user.displayName || draft.displayName,
        registeredAt: new Date().toISOString(),
      };
      await persistIdentity(updatedIdentity);

      const context = response.context ?? (await authServiceRef.current.fetchContext()).context;
      setRingContext(context);
      return { identity: updatedIdentity, context };
    },
    [persistIdentity],
  );

  const ensureIdentity = useCallback(async (): Promise<AOTIdentity> => {
    setIsLoading(true);
    try {
      initializeCrypto();

      let current = identity;
      let context: RingContext | null = ringContext;

      if (!current) {
        const { privateKey, publicKey } = await generateKeyPair();
        current = {
          identifier: createRandomIdentifier(),
          displayName: undefined,
          publicKey,
          privateKey,
        };

        const registered = await registerIdentity(
          {
            identifier: current.identifier,
            publicKey: current.publicKey,
          },
          current,
        );
        context = registered.context;
        setRingContext(context);
        setIdentity(registered.identity);
        return registered.identity;
      }

      if (!current.registeredAt) {
        const registered = await registerIdentity(
          {
            identifier: current.identifier,
            publicKey: current.publicKey,
          },
          current,
        );
        setRingContext(registered.context);
        setIdentity(registered.identity);
        return registered.identity;
      }

      if (!context) {
        const fetched = await authServiceRef.current.fetchContext();
        if (!fetched.success) {
          throw new Error('Failed to fetch ring context');
        }
        setRingContext(fetched.context);
      }

      return current;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to prepare identity';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [identity, ringContext, registerIdentity]);

  const refreshContext = useCallback(async (): Promise<RingContext> => {
    setIsLoading(true);
    try {
      const result = await authServiceRef.current.fetchContext();
      if (!result.success) {
        throw new Error('Failed to load ring context');
      }
      setRingContext(result.context);
      return result.context;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh ring context';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const otherMembers = (ringContext?.users || []).filter(
    (member) => identity && member.publicKey !== identity.publicKey,
  );

  return {
    identity,
    ringContext,
    otherMembers,
    isLoading,
    error,
    ensureIdentity,
    refreshContext,
    clearError,
  };
};
