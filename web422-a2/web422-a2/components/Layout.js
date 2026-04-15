import MainNav from "./MainNav";
import RouteGuard from "./RouteGuard";
import { Container } from "react-bootstrap";

export default function Layout(props) {
  return (
    <>
      <MainNav />
      <br />
      <Container>
        <RouteGuard>{props.children}</RouteGuard>
      </Container>
      <br />
    </>
  );
}
