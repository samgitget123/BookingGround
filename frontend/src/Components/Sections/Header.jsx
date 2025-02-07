import {Navbar , Nav , Container } from 'react-bootstrap';
import React from 'react'
// import brandlogo from '../../Images/bmgicondisplay.png'
import { Gi3dGlasses } from "react-icons/gi";
const Header = () => {
  return (
    <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <Container>
                <Navbar.Brand href="/">Book My <span style={{color:"#00EE64" , fontWeight:"bold"}}>Ground</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-light">
                        {/* <Nav.Link href="/" className='text-light'>Sign In</Nav.Link>
                        <Nav.Link href="/" className='text-light'>Log In</Nav.Link> */}
                        <Nav.Link href="/createground" className='text-light'>Lets <span style={{color:"#00EE64" , fontWeight:"bold"}}>Join</span> <Gi3dGlasses size={30}/></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </header>
  )
}

export default Header