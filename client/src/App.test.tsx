import * as React from 'react'
import {render, screen} from '@testing-library/react'
import App from './App'

test('renders the app', () => {
  render(<App />)
  const layoutElement = screen.getByTestId('default-layout')
  const homePageElement = screen.getByTestId('home-page')
  expect(layoutElement).toBeInTheDocument()
  expect(homePageElement).toBeInTheDocument()
})
