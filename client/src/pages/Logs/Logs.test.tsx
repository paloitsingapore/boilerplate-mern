import * as React from 'react'
import {render, screen} from '@testing-library/react'
import Logs from './'

test('renders the logs page', () => {
  render(<Logs />)
  const logsPageElement = screen.getByTestId('logs-page')
  const logsTable = screen.getByTestId('logs-table')
  const btnAddLog = screen.getByTestId('btn-add-log')

  expect(logsPageElement).toBeInTheDocument()
  expect(logsTable).toBeInTheDocument()
  expect(btnAddLog).toBeInTheDocument()
})
