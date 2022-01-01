import * as React from 'react'
import {render, screen} from '@testing-library/react'
import Home from './'

test('renders the home page', () => {
  render(<Home />)
  const homePageElement = screen.getByTestId('home-page')
  expect(homePageElement).toBeInTheDocument()
})
