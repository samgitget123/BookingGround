import {Navbar , Nav , Container } from 'react-bootstrap';
import React from 'react'

const Header = () => {
  return (
    <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <Container>
                <Navbar.Brand href="/">Book My Ground</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Sign In</Nav.Link>
                        <Nav.Link href="/">Log In</Nav.Link>
                        <Nav.Link href="/createground">Lets Create</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </header>
  )
}

export default Header