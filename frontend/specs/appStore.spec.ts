import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import appReducer, { fetchAbout } from '../src/store/appSlice';
import { apiClient } from '../src/api/client';

vi.mock('../src/api/client', () => ({
  apiClient: { get: vi.fn() },
}));

const mockedGet = vi.mocked(apiClient.get);

const makeStore = () => configureStore({ reducer: { app: appReducer } });

describe('appSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty state', () => {
    const store = makeStore();
    const { message, loading, error } = store.getState().app;
    expect(message).toBeNull();
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });

  it('sets loading while fetching', async () => {
    const store = makeStore();
    let resolve!: (v: unknown) => void;
    mockedGet.mockReturnValue(new Promise((r) => (resolve = r)));

    const fetchPromise = store.dispatch(fetchAbout());
    expect(store.getState().app.loading).toBe(true);

    resolve({ data: { message: 'ok' } });
    await fetchPromise;
  });

  it('stores the API result on success', async () => {
    const store = makeStore();
    mockedGet.mockResolvedValue({ data: { message: 'hello from api' } });

    await store.dispatch(fetchAbout());

    const { message, loading, error } = store.getState().app;
    expect(message).toBe('hello from api');
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });

  it('stores error message on failure', async () => {
    const store = makeStore();
    mockedGet.mockRejectedValue(new Error('Network error'));

    await store.dispatch(fetchAbout());

    const { message, loading, error } = store.getState().app;
    expect(error).toBe('Network error');
    expect(loading).toBe(false);
    expect(message).toBeNull();
  });
});
