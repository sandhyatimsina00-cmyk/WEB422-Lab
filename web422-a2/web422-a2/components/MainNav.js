import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(readToken());
  }, [router.pathname]);

  function logout() {
    removeToken();
    setToken(null);
    router.push("/login");
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
        <Container>
          <Navbar.Brand>Sandhya Timsina</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Books</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>

            {token && (
              <Nav>
                <NavDropdown title={token.userName} id="user-nav-dropdown">
                  <NavDropdown.Item href="/favourites">Favourites</NavDropdown.Item>
                  <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}

            {!token && (
              <Nav>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
