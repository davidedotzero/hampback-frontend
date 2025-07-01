// src/components/home/InteractiveHero.test.tsx
// This file contains tests for the final version of the InteractiveHero component.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InteractiveHero from './InteractiveHero';
import { HeroImage } from '@/types/data';

// --- Mocking the Three.js library ---
// We mock the parts of Three.js to prevent errors in the JSDOM test environment,
// which doesn't have a WebGL context for rendering.
jest.mock('three', () => {
  const originalThree = jest.requireActual('three');
  return {
    ...originalThree,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      setPixelRatio: jest.fn(),
      render: jest.fn(),
      domElement: document.createElement('canvas'), // Provide a dummy canvas
    })),
    TextureLoader: jest.fn().mockImplementation(() => ({
      load: jest.fn().mockReturnValue({}), // Return a dummy texture object
    })),
  };
});

// --- Mock Data ---
// This data simulates what the component would receive as props.
const mockHeroImages: HeroImage[] = [
  { id: 1, product_name: 'Pro Drum Kit', category_name: 'Drums', url: 'url1', product_slug: 'pro-drum-kit', alt: 'Pro Drum Kit Image' },
  { id: 2, product_name: 'Vintage Guitar', category_name: 'Guitars', url: 'url2', product_slug: 'vintage-guitar', alt: 'Vintage Guitar Image' },
  { id: 3, product_name: 'Studio Microphone', category_name: 'Audio', url: 'url3', product_slug: 'studio-mic', alt: 'Studio Microphone Image' },
];

describe('InteractiveHero Component', () => {
  const user = userEvent.setup();

  // Test 1: Initial Rendering
  it('should render the first item correctly on initial load', () => {
    render(<InteractiveHero heroImages={mockHeroImages} />);

    // Check if the title and category of the first item are displayed
    expect(screen.getByText('Pro Drum Kit')).toBeInTheDocument();
    expect(screen.getByText('Drums')).toBeInTheDocument();

    // Check if the correct number of dots are rendered
    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    expect(dots).toHaveLength(3);
    // The first dot should have the active style
    expect(dots[0]).toHaveClass('scale-125');
  });

  // Test 2: Dot Navigation
  it('should display the correct content when a dot is clicked', async () => {
    render(<InteractiveHero heroImages={mockHeroImages} />);

    // Find the third dot button (for "Studio Microphone")
    const thirdDot = screen.getByRole('button', { name: /go to slide 3/i });
    
    // Act: Simulate user clicking the third dot
    await user.click(thirdDot);

    // Assert: Wait for the text to update and check the content
    expect(await screen.findByText('Studio Microphone')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    
    // The third dot should now be active
    expect(thirdDot).toHaveClass('scale-125');
    // The first dot should no longer be active
    const firstDot = screen.getByRole('button', { name: /go to slide 1/i });
    expect(firstDot).not.toHaveClass('scale-125');
  });

  // Test 3: Handling empty data
  it('should render gracefully with fallback text if no images are provided', () => {
    // Render with an empty array and expect no errors
    render(<InteractiveHero heroImages={[]} />);
    
    // Check that the fallback text is shown
    expect(screen.getByText('Hampback Gear')).toBeInTheDocument();
    expect(screen.getByText('Featured Product')).toBeInTheDocument();
  });
});
