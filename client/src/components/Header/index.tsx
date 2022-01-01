import * as React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'

function Header() {
  return (
    <Navbar bg="light" expand="lg" className="header">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" data-testid="nav-link-home">Home</Nav.Link>
            <Nav.Link href="/logs" data-testid="nav-link-logs">Logs</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
