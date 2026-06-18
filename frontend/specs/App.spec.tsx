import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import appReducer from '../src/store/appSlice';
import App from '../src/App';

vi.mock('../src/api/client', () => ({
  apiClient: { get: vi.fn().mockResolvedValue({ data: { message: null } }) },
}));

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: { app: appReducer } });
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>,
  );
};

describe('App routing', () => {
  it('renders the home page at /', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /template app/i })).toBeInTheDocument();
  });

  it('renders the 404 page for unknown routes', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
  });
});
