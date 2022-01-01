import * as React from 'react'
import {render, screen} from '@testing-library/react'
import Header from './'

test('renders the header', () => {
  render(<Header />)
  const navLinkHomeElement = screen.getByTestId('nav-link-home')
  const navLinkLogsElement = screen.getByTestId('nav-link-logs')
  expect(navLinkHomeElement).toBeInTheDocument()
  expect(navLinkLogsElement).toBeInTheDocument()
  expect(navLinkHomeElement.getAttribute('href')).toBe('/')
  expect(navLinkLogsElement.getAttribute('href')).toBe('/logs')
})
