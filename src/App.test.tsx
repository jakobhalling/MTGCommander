import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';

describe('App Component Setup', () => {
  test('renders with Redux Provider and Router', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    
    // Basic test to ensure the app renders
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });
}); 