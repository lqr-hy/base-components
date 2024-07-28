import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Button from '../Button';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';

describe('Button', () => {
  it('should render button with correct text', () => {
    const buttonText = 'Click me';
    const { getByText } = render(<Button>{buttonText}</Button>);
    const buttonElement = getByText(buttonText);
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    const onClickMock = vi.fn();
    const { getByText } = render(<Button onClick={onClickMock}>Click me</Button>);
    const buttonElement = getByText('Click me');
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalled();
  });

  it('should disable button when disabled prop is true', () => {
    const { getByText } = render(<Button disabled>Click me</Button>);
    const buttonElement = getByText('Click me');
    expect(buttonElement).toBeDisabled();
  });
});
