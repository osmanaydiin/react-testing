import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmojiResults from '../EmojiResults';
import Clipboard from 'clipboard';

jest.mock('clipboard');

beforeEach(() => {
  Clipboard.mockClear();
});

describe('EmojiResults', () => {
  const mockEmojiData = [
    { title: 'Grinning', symbol: '😀' },
    { title: 'Smile', symbol: '😊' },
    { title: 'Heart', symbol: '❤️' },
    { title: 'Cat', symbol: '🐱' },
    { title: 'Dog', symbol: '🐶' }
  ];

  it('renders emoji data correctly', () => {
    render(<EmojiResults emojiData={mockEmojiData} />);
    
    const container = screen.getByTestId('emoji-results');
    expect(container).toBeInTheDocument();

    // Her bir emoji için title'ın render edildiğini kontrol et
    mockEmojiData.forEach(emoji => {
      expect(screen.getByText(emoji.title)).toBeInTheDocument();
    });

    // Her bir emoji için img elementinin var olduğunu kontrol et
    mockEmojiData.forEach(emoji => {
      expect(screen.getByAltText(emoji.title)).toBeInTheDocument();
    });

    // Emoji satırlarını kontrol et
    const emojiRows = container.querySelectorAll('.component-emoji-result-row');
    expect(emojiRows).toHaveLength(mockEmojiData.length);
  });

  it('renders empty state when no emoji data is provided', () => {
    render(<EmojiResults emojiData={[]} />);
    const container = screen.getByTestId('emoji-results');
    expect(container).toBeInTheDocument();
    expect(container.children).toHaveLength(0);
  });

  it('filters emoji list based on search term', () => {
    const { rerender } = render(<EmojiResults emojiData={mockEmojiData} />);
    
    // Tüm emojilerin gösterildiğini kontrol et
    const allEmojiRows = screen.getByTestId('emoji-results').querySelectorAll('.component-emoji-result-row');
    expect(allEmojiRows).toHaveLength(mockEmojiData.length);

    // "cat" ile filtreleme
    const filteredData = mockEmojiData.filter(emoji => 
      emoji.title.toLowerCase().includes('cat')
    );
    rerender(<EmojiResults emojiData={filteredData} />);

    // Sadece "Cat" emojisinin gösterildiğini kontrol et
    expect(screen.getByText('Cat')).toBeInTheDocument();
    expect(screen.queryByText('Dog')).not.toBeInTheDocument();
    expect(screen.queryByText('Grinning')).not.toBeInTheDocument();

    // "smile" ile filtreleme
    const smileFilteredData = mockEmojiData.filter(emoji => 
      emoji.title.toLowerCase().includes('smile')
    );
    rerender(<EmojiResults emojiData={smileFilteredData} />);

    // Sadece "Smile" emojisinin gösterildiğini kontrol et
    expect(screen.getByText('Smile')).toBeInTheDocument();
    expect(screen.queryByText('Cat')).not.toBeInTheDocument();
  });

  it('initializes clipboard functionality', () => {
    const mockClipboard = {
      on: jest.fn(),
      destroy: jest.fn()
    };
    Clipboard.mockImplementation(() => mockClipboard);

    render(<EmojiResults emojiData={mockEmojiData} />);
    expect(Clipboard).toHaveBeenCalledTimes(1);
    expect(Clipboard).toHaveBeenCalledWith('.copy-to-clipboard');
  });

  it('cleans up clipboard on unmount', () => {
    const mockClipboard = {
      on: jest.fn(),
      destroy: jest.fn()
    };
    Clipboard.mockImplementation(() => mockClipboard);

    const { unmount } = render(<EmojiResults emojiData={mockEmojiData} />);
    unmount();

    expect(mockClipboard.destroy).toHaveBeenCalledTimes(1);
  });
}); 