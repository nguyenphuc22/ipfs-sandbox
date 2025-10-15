import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/AuthService';
import { AOTIdentity, RegisteredRingMember, RingContext } from '../types';
import { generateKeyPair, initializeCrypto, toCompressedPublicKey } from '../utils/aotCrypto';

const STORAGE_KEY = 'aot_identity_v1';
const PUBLIC_KEY_STORAGE_KEY = 'aot_public_key';
const SECRET_KEY_STORAGE_KEY = 'aot_secret_key';

const createRandomIdentifier = () => `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const serializeIdentity = (identity: AOTIdentity) => JSON.stringify(identity);
const deserializeIdentity = (value: string | null): AOTIdentity | null => {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    // Migration: Remove userId field if it exists from old storage format
    if (parsed && 'userId' in parsed) {
      const { userId, ...rest } = parsed;
      return rest as AOTIdentity;
    }
    return parsed as AOTIdentity;
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
  initializeIdentity: (displayName: string) => Promise<AOTIdentity>;
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

  const syncKeyMaterial = useCallback(async (value: AOTIdentity | null) => {
    if (!value) {
      await AsyncStorage.multiRemove([PUBLIC_KEY_STORAGE_KEY, SECRET_KEY_STORAGE_KEY]);
      return;
    }

    const entries: [string, string][] = [];
    if (value.publicKey) {
      entries.push([PUBLIC_KEY_STORAGE_KEY, value.publicKey]);
    }
    if (value.privateKey) {
      entries.push([SECRET_KEY_STORAGE_KEY, value.privateKey]);
    }

    if (entries.length > 0) {
      await AsyncStorage.multiSet(entries);
    } else {
      await AsyncStorage.multiRemove([PUBLIC_KEY_STORAGE_KEY, SECRET_KEY_STORAGE_KEY]);
    }
  }, []);

  const loadStoredIdentity = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = deserializeIdentity(stored);
      if (parsed) {
        setIdentity(parsed);
        await syncKeyMaterial(parsed);
      }
    } catch (err) {
      console.warn('Failed to load stored AOT identity:', err);
    }
  }, [syncKeyMaterial]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeCrypto();
      loadStoredIdentity();
    }
  }, [loadStoredIdentity]);

  const persistIdentity = useCallback(async (value: AOTIdentity) => {
    setIdentity(value);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY, serializeIdentity(value)),
      syncKeyMaterial(value),
    ]);
  }, [syncKeyMaterial]);

  const resolveIdentityFromContext = useCallback(
    async (draft: AOTIdentity): Promise<{ identity: AOTIdentity; context: RingContext }> => {
      const fetched = await authServiceRef.current.fetchContext();
      if (!fetched.success) {
        throw new Error('Failed to load ring context');
      }

      // Normalize both keys to compressed format for comparison
      const draftKeyCompressed = toCompressedPublicKey(draft.publicKey);
      const matched = fetched.context.users.find((member) => {
        try {
          const memberKeyCompressed = toCompressedPublicKey(member.publicKey);
          return memberKeyCompressed === draftKeyCompressed || member.identifier === draft.identifier;
        } catch (error) {
          console.warn('[AOT Identity] Failed to normalize member key:', member.publicKey, error);
          return member.identifier === draft.identifier;
        }
      });

      if (!matched) {
        throw new Error('Registered identity not found in ring context');
      }

      const updatedIdentity: AOTIdentity = {
        ...draft,
        identifier: matched.identifier || draft.identifier,
        displayName: matched.displayName || draft.displayName,
        registeredAt: matched.createdAt || draft.registeredAt || new Date().toISOString(),
      };

      await persistIdentity(updatedIdentity);
      setRingContext(fetched.context);
      return { identity: updatedIdentity, context: fetched.context };
    },
    [persistIdentity],
  );

  const registerIdentity = useCallback(
    async (draft: AOTIdentity): Promise<{ identity: AOTIdentity; context: RingContext }> => {
      const response = await authServiceRef.current.registerUser({
        identifier: draft.identifier,
        displayName: draft.displayName || draft.identifier,
        publicKey: draft.publicKey,
        escrowedIdentity: draft.escrowedIdentity ?? null,
      });
      if (!response.success || !response.user) {
        throw new Error(response.error || 'Failed to register identity');
      }

      const updatedIdentity: AOTIdentity = {
        ...draft,
        identifier: response.user.identifier || draft.identifier,
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

  const initializeIdentity = useCallback(
    async (displayName: string): Promise<AOTIdentity> => {
      const trimmedName = displayName.trim();
      if (!trimmedName) {
        const message = 'Display name is required';
        setError(message);
        throw new Error(message);
      }

      setIsLoading(true);
      try {
        initializeCrypto();

        let draft: AOTIdentity;
        if (identity) {
          draft = {
            ...identity,
            displayName: trimmedName,
          };
        } else {
          const { privateKey, publicKey } = await generateKeyPair();
          draft = {
            identifier: createRandomIdentifier(),
            displayName: trimmedName,
            publicKey,
            privateKey,
          };
        }

        try {
          const registered = await registerIdentity(draft);
          setRingContext(registered.context);
          setIdentity(registered.identity);
          setError(null);
          return registered.identity;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to initialize identity';
          if (message.toLowerCase().includes('already registered')) {
            const resolved = await resolveIdentityFromContext(draft);
            setIdentity(resolved.identity);
            setError(null);
            return resolved.identity;
          }
          setError(message);
          throw err instanceof Error ? err : new Error(message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [identity, registerIdentity, resolveIdentityFromContext],
  );

  const ensureIdentity = useCallback(async (): Promise<AOTIdentity> => {
    setIsLoading(true);
    try {
      initializeCrypto();

      let current = identity;
      let context: RingContext | null = ringContext;

      if (!current) {
        throw new Error('Identity has not been initialized');
      }

      if (!current.displayName) {
        throw new Error('Please complete identity initialization before continuing');
      }

      if (!current.registeredAt) {
        const registered = await registerIdentity(current);
        setRingContext(registered.context);
        setIdentity(registered.identity);
        return registered.identity;
      }

      if (!context) {
        const resolved = await resolveIdentityFromContext(current);
        setRingContext(resolved.context);
      }

      return current;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to prepare identity';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [identity, registerIdentity, resolveIdentityFromContext, ringContext]);

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
    initializeIdentity,
    ensureIdentity,
    refreshContext,
    clearError,
  };
};
