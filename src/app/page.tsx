"use client";
import { useState } from "react";
import { GEMINI_API_KEY } from "@/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import { TbWaveSawTool, TbSend } from "react-icons/tb";
import { FiLoader } from "react-icons/fi";

const Home = () => {
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [additionalRequirements, setAdditionalRequirements] =
    useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const genAI = new GoogleGenerativeAI(
      GEMINI_API_KEY.first + GEMINI_API_KEY.second + GEMINI_API_KEY.third
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      if (!position || !experience || !additionalRequirements) {
        setError(
          "Please provide a job title, years of experience and additional requirements"
        );
        setLoading(false);
        return;
      }
      const result = await model.generateContent(
        `Generate a job description for this ${position} , xp is ${experience}, see whatever you like. dont forget ${additionalRequirements} make it in html format which I can send over in email`
      );
      const response = result.response.text(); // Ensure we await the text extraction
      setJobDescription(response);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error generating job description:", error);
      setError("Error generating job description.");
      setJobDescription(null); // Clear any previous job description
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      body: JSON.stringify({
        jobDescription: jobDescription,
        email: email,
        position: position,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setError(null);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url('/jd-back.png')`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!jobDescription ? (
        <Card
          className="p-4 shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <Row>
            <Col className="text-center">
              <h2 className="text-primary mb-4">JD Generator</h2>
              <p>Create JDs fast with the help of our AI</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="position" className="mb-3">
                  <Form.Label className="fw-bold d-flex justify-content-start">
                    Job Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Software Engineer"
                  />
                </Form.Group>
                <Form.Group controlId="experience" className="mb-3">
                  <Form.Label className="fw-bold d-flex justify-content-start">
                    Years of Experience Required
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="3"
                  />
                </Form.Group>
                <Form.Group controlId="additionalRequirements" className="mb-3">
                  <Form.Label className="fw-bold d-flex justify-content-start">
                    Additional Requirements
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="AWS Certified, etc."
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  {loading ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <TbWaveSawTool /> Generate
                    </>
                  )}
                </Button>
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
              </Form>
            </Col>
          </Row>
        </Card>
      ) : (
        <Row className="position-fixed bottom-0 start-50 translate-middle-x w-100 my-4">
          <Col xs={12}>
            <Card className="p-3 mx-auto" style={{ maxWidth: "500px" }}>
              <h2 className="text-primary mb-4 text-center">JD Generator</h2>
              <>
                <Form
                  onSubmit={handleSendEmail}
                  className="d-flex align-items-center"
                >
                  <div className="d-flex flex-column flex-grow-1 me-2">
                    <Form.Label className="fw-bold mb-1">Email</Form.Label>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="johnDoe@example.com"
                    />
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-auto mt-4"
                    style={{ minWidth: "100px" }} // Ensure the button has a minimum width
                  >
                    <TbSend /> Send
                  </Button>
                </Form>
              </>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
