// src/components/search/InstantSearch.test.tsx
// This file is updated to suppress expected console errors during tests.

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InstantSearch from './InstantSearch';
import { Product } from '@/types/product';

// --- Mocking Next.js Navigation ---
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// --- Mocking the global fetch function ---
global.fetch = jest.fn();

// --- Mock Data ---
const mockSearchResults: Product[] = [
  { id: 201, name: 'Pro Guitar Amp', price: '4500', slug: 'pro-guitar-amp', short_description: '', description: '', categories: [], images: [] },
  { id: 202, name: 'Vintage Guitar', price: '7500', slug: 'vintage-guitar', short_description: '', description: '', categories: [], images: [] },
];

describe('InstantSearch Component', () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  // Test 1: Typing and seeing results after debounce
  it('should fetch and display search results after user stops typing', async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    render(<InstantSearch />);
    
    // Act
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'guitar');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(await screen.findByText('Pro Guitar Amp')).toBeInTheDocument();
    expect(screen.getByText('Vintage Guitar')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/search?q=guitar');
  });

  // Test 2: Displaying "No products found" message
  it('should display a "no products found" message when API returns an empty array', async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<InstantSearch />);

    // Act
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'nothing');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(await screen.findByText(/no products found for "nothing"/i)).toBeInTheDocument();
  });

  // Test 3: Handling API errors
  it('should not display results if the API call fails', async () => {
    // ** THE FIX: We mock console.error to prevent Jest from showing the expected error in the log. **
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Arrange
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API is down'));
    
    render(<InstantSearch />);

    // Act
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'error');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Assert
    expect(screen.queryByText('Pro Guitar Amp')).not.toBeInTheDocument();
    // We can also assert that our expected error was logged
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore the original console.error function after the test
    consoleErrorSpy.mockRestore();
  });
});
