// src/components/layout/ProductFilter.test.tsx
// This file contains tests for the ProductFilter component.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductFilter from './ProductFilter';
import { Category } from '@/types/category';

// --- Mock Data and Functions ---
const mockCategories: Category[] = [
  { id: 1, name: 'Guitars', slug: 'guitars' },
  { id: 2, name: 'Drums', slug: 'drums' },
];

// We use jest.fn() to create mock functions. This allows us to check
// if these functions have been called and with what arguments.
const mockOnCategoryChange = jest.fn();
const mockOnSearchChange = jest.fn();
const mockOnSortChange = jest.fn();

// A helper function to render the component with default props for each test
const renderComponent = () => {
  render(
    <ProductFilter
      categories={mockCategories}
      selectedCategory="all"
      sortBy="newest"
      onCategoryChange={mockOnCategoryChange}
      onSearchChange={mockOnSearchChange}
      onSortChange={mockOnSortChange}
    />
  );
};

describe('ProductFilter Component', () => {
  const user = userEvent.setup();

  // Clear mock function calls before each test to ensure a clean state
  beforeEach(() => {
    mockOnCategoryChange.mockClear();
    mockOnSearchChange.mockClear();
    mockOnSortChange.mockClear();
  });

  // Test 1: Initial Rendering
  it('should render all filter elements correctly', () => {
    renderComponent();

    // Check if the main sections are visible
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();

    // Check for specific elements
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All Categories' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guitars' })).toBeInTheDocument();
  });

  // Test 2: Search Input Interaction
  it('should call onSearchChange with the correct value when typing in the search input', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await user.type(searchInput, 'test search');

    // Assert that the callback was called with the value we typed
    expect(mockOnSearchChange).toHaveBeenCalledWith('test search');
  });

  // Test 3: Category Button Interaction
  it('should call onCategoryChange with the correct slug when a category button is clicked', async () => {
    renderComponent();
    
    const guitarsButton = screen.getByRole('button', { name: 'Guitars' });
    await user.click(guitarsButton);

    // Assert that the callback was called with the 'guitars' slug
    expect(mockOnCategoryChange).toHaveBeenCalledWith('guitars');
  });
  
  it('should call onCategoryChange with "all" when the "All Categories" button is clicked', async () => {
    renderComponent();

    const allCategoriesButton = screen.getByRole('button', { name: 'All Categories' });
    await user.click(allCategoriesButton);

    // Assert that the callback was called with 'all'
    expect(mockOnCategoryChange).toHaveBeenCalledWith('all');
  });
  
  // Test 4: Sort Dropdown Interaction
  it('should call onSortChange with the correct value when an option is selected', async () => {
    renderComponent();

    const sortBySelect = screen.getByRole('combobox', { name: /sort by/i });
    // userEvent.selectOptions is the best way to handle dropdowns
    await user.selectOptions(sortBySelect, 'price-asc');

    // Assert that the callback was called with the selected value
    expect(mockOnSortChange).toHaveBeenCalledWith('price-asc');
  });
});
