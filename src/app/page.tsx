"use client";
import { useState, useEffect } from "react";
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
import Spinner from "@/components/Spinner";
import useLocalStorage from "@/hooks/useLocalStorage";

const Home = () => {
  const { setValue: setUserEmail, getValue: getUserEmail } = useLocalStorage<string>();
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailPrompt, setEmailPrompt] = useState<boolean>(false);

  // Check if email is stored in local storage on component mount
  useEffect(() => {
    const storedEmail = getUserEmail("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setEmailPrompt(true); // Prompt for email if not found
    }
  }, [getUserEmail]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setUserEmail("userEmail",email); // Store the email in local storage
      setEmailPrompt(false); // Hide email prompt and proceed to JD generation
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const genAI = new GoogleGenerativeAI(
      GEMINI_API_KEY.first + GEMINI_API_KEY.second + GEMINI_API_KEY.third
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      if (!position || !experience) {
        setError("Please provide a job title and years of experience");
        setLoading(false);
        return;
      }
      const result = await model.generateContent(
        `Generate a job description for this ${position} , xp is ${experience}, see whatever you like. dont forget ${additionalRequirements} make it in docs format which I can send over in email`
      );
      const response = await result.response.text();
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
    const storedEmail = getUserEmail("userEmail"); // Fetch email from local storage
    if (!storedEmail) {
      setError("No email found.");
      return;
    }
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      body: JSON.stringify({
        jobDescription: jobDescription,
        email: storedEmail,
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
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
    >
      {/* Background Blur */}
      {!jobDescription && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url('/jd-back.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            filter: "blur(2px)",
            WebkitFilter: "blur(2px)",
            zIndex: -1,
          }}
        />
      )}

      {/* Email prompt */}
      {emailPrompt ? (
        <Card
          className="p-4 shadow-lg position-relative"
          style={{
            width: "450px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
          }}
        >
          <Row>
            <Col className="text-center">
              <h2 className="text-primary mb-4">Enter Your Email</h2>
              <Form onSubmit={handleEmailSubmit}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johnDoe@example.com"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Continue
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      ) : (
        <>
          {/* Content */}
          {!jobDescription ? (
            <Card
              className="p-4 shadow-lg position-relative"
              style={{
                width: "450px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1,
              }}
            >
              <Row>
                <Col className="text-center">
                  <h2 className="text-primary mb-4">JD Generator</h2>
                  <p>Create JDs fast with the help of our AI</p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="position" className="mb-3">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </Form.Group>
                    <Form.Group controlId="experience" className="mb-3">
                      <Form.Label>Years of Experience Required</Form.Label>
                      <Form.Control
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="3"
                      />
                    </Form.Group>
                    <Form.Group controlId="additionalRequirements" className="mb-3">
                      <Form.Label>Additional Requirements</Form.Label>
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
                        <div className="d-flex justify-content-center align-items-center">
                          <Spinner />
                        </div>
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
            <>
              <Container fluid className="d-flex flex-column align-items-center">
                <Col sm={6} className="">
                  <div>{jobDescription}</div>
                </Col>
                <Row className="w-100 my-4">
                  <Col xs={12} className="d-flex justify-content-center">
                    <Card className="p-3 mx-auto" style={{ maxWidth: "500px" }}>
                      <h2 className="text-primary mb-4 text-center">JD Generator</h2>
                      <Form onSubmit={handleSendEmail} className="d-flex align-items-center">
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-auto mt-2"
                          style={{ minWidth: "100px" }}
                        >
                          <TbSend /> Send JD to {email}
                        </Button>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;