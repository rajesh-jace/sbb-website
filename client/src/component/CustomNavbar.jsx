import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CustomNavbar.css'; // Import the custom CSS file

const CustomNavbar = ({ isOwnerLoggedIn }) => {
  return (
    <Navbar bg="light" expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-name">
          Sree Balaji Builders
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" activeClassName="active-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/projects" activeClassName="active-link">
              Projects
            </Nav.Link>
            <Nav.Link as={Link} to="/buildyourproject" activeClassName="active-link">
              Build Your Own
            </Nav.Link>
            <Nav.Link as={Link} to="/aboutus" activeClassName="active-link">
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" activeClassName="active-link">
              Contact Us
            </Nav.Link>
          </Nav>

          {isOwnerLoggedIn ? (
            <Nav>
              <NavDropdown title="Owner Dashboard" id="owner-dropdown">
                <NavDropdown.Item as={Link} to="/dashboard">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/manage-projects">
                  Manage Projects
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/manage-requests">
                  Manage Requests
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/logout">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login" activeClassName="active-link">
                Owner Login
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
