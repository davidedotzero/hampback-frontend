// src/components/layout/Footer.test.tsx
// This is the updated test file using @testing-library/user-event for more reliable tests.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import user-event
import '@testing-library/jest-dom';
import Footer from './Footer';

// Mocking the global fetch function remains the same.
global.fetch = jest.fn();

describe('Footer Newsletter Form', () => {
  // We use userEvent.setup() for a better testing experience.
  const user = userEvent.setup();

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  // Test 1: Successful subscription
  it('should display a success message after a successful subscription', async () => {
    // Arrange: Mock a successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Successfully subscribed!' }),
    });

    render(<Footer />);

    // Act: Simulate user typing and clicking with user-event
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(signUpButton);

    // Assert: Check for UI changes
    // Wait for the success message to appear and check the text content
    const successMessage = await screen.findByText('Thank you for subscribing!');
    expect(successMessage).toBeInTheDocument();

    // Check if the input is cleared after success
    expect(emailInput).toHaveValue('');
  });

  // Test 2: API Error
  it('should display an error message if the subscription fails on the server', async () => {
    // Arrange: Mock a failed API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'This email is already subscribed.' }),
    });

    render(<Footer />);

    // Act
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'duplicate@example.com');
    await user.click(signUpButton);

    // Assert
    const errorMessage = await screen.findByText('This email is already subscribed.');
    expect(errorMessage).toBeInTheDocument();
  });

  // Test 3: Client-side validation (The one that was failing)
  it('should display a validation error for an invalid email and not call the API', async () => {
    render(<Footer />);

    // Act
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(signUpButton);

    // Assert
    // Check for the validation message
    const validationMessage = await screen.findByText('Please enter a valid email address.');
    expect(validationMessage).toBeInTheDocument();

    // Ensure fetch was NOT called
    expect(fetch).not.toHaveBeenCalled();
  });
});
