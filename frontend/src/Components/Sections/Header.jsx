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
                    <Nav className="ms-auto text-light">
                        <Nav.Link href="/" className='text-light'>Sign In</Nav.Link>
                        <Nav.Link href="/" className='text-light'>Log In</Nav.Link>
                        <Nav.Link href="/createground" className='text-light'>Lets Create</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </header>
  )
}

export default Header