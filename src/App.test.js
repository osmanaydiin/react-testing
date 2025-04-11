import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import EmojiResultRow from './EmojiResultRow';

describe('App', () => {

  beforeEach(() => {
    render(<App />);
  });

  it('renders App component', () => {
    expect(screen.getByText('Emoji Search')).toBeInTheDocument();
  });


});