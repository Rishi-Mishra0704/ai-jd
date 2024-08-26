"use client";
import { useState } from "react";
import { GEMINI_API_KEY } from "@/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';


const Home = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.first + GEMINI_API_KEY.second + GEMINI_API_KEY.third);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(`Generate a job description for this ${prompt}, give it in html format.`);
      const response = result.response;
      const text = response.text();
      setJobDescription(text);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error generating job description:", error);
      setError("Error generating job description.");
      setJobDescription(null); // Clear any previous job description
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h1 className="text-center mb-4">Generate Job Description</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="prompt" className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your Position and Tech stack"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Generate
            </Button>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Form>
        </Col>
        <Col md={6}>
          {jobDescription && (
            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Generated Job Description</Card.Title>
                <Card.Text>
                  {jobDescription}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
