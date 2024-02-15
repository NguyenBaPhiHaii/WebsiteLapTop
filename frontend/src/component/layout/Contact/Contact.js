
import React, { useState } from "react";
import emailjs from "emailjs-com";
import styled from "styled-components";
import { useAlert } from "react-alert";

const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 50px;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Form = styled.form`
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media only screen and (max-width: 768px) {
    width: 300px;
  }
`;

const Input = styled.input`
  padding: 20px;
  background-color: #e8e6e6;
  border: none;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 20px;
  border: none;
  border-radius: 5px;
  background-color: #e8e6e6;
`;

const Button = styled.button`
  background-color: tomato;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  padding: 20px;
`;

const Contact = () => {
  const alert = useAlert();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      to_email: "phihai2473@gmail.com",
      message: message,
    };

    emailjs
      .send(
        "service_vxn1j5o",
        "template_akj1cxm",
        templateParams,
        "2iIYz5IHpr_264NWn"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert.success("Tin nhắn đã được gửi thành công!");
          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Section>
      <Container>
        <Left>
          <Form onSubmit={handleSubmit}>
            <Title style={{ textAlign: "center" }}>Contact Us</Title>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextArea
              placeholder="Write your message"
              rows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </Form>
        </Left>
      </Container>
    </Section>
  );
};

export default Contact;
