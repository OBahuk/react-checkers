import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders board', () => {
  render(<App />);
  const linkElement = screen.getByTestId("board");
  expect(linkElement).toBeInTheDocument();
});
