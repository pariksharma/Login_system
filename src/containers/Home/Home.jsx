import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Row, Col, Container } from "react-bootstrap";
import LinkSend from "../../components/LinkSend/LinkSend";

export default function Home() {
  return (
    <>
      <Header />
      <section>
        <Container className="m-5 p-5">
          <Row className="m-5">
            <Col>
              <h1>Welcome To Physics Galaxy Dashboard</h1>
            </Col>
          </Row>
        </Container>
      </section>
      <LinkSend />
      <Footer />
    </>
  );
}
