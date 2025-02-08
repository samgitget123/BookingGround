import { Navbar, Nav, Container } from 'react-bootstrap';
import React from 'react';
import { Gi3dGlasses } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user's token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    
    // Optionally, redirect the user to the login page
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Check if the token exists

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">Book My <span style={{ color: "#00EE64", fontWeight: "bold" }}>Ground</span></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-light">
              {/* Conditionally render the Login/Logout button */}
             
              {/* Other links */}
              <Nav.Link href="/createground" className='text-light'>Lets <span style={{ color: "#00EE64", fontWeight: "bold" }}>Join</span> <Gi3dGlasses size={30} /></Nav.Link>
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout} className='text-light' style={{ cursor: 'pointer' }}>Logout</Nav.Link>
              ) : (
                <Nav.Link href="/login" className='text-light'>Login</Nav.Link>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
