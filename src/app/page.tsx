"use client";
import { useState } from "react";
import { GEMINI_API_KEY } from "@/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

const Home = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.first + GEMINI_API_KEY.second + GEMINI_API_KEY.third);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(`Generate a job description for this ${prompt}, give it in html format.`);
      const response = await result.response.text(); // Ensure we await the text extraction
      setJobDescription(response);
      setError(null); // Clear any previous errors
      setActivities([...activities, `${prompt.split(' ').slice(0, 3).join(' ')}...`]);
    } catch (error) {
      console.error("Error generating job description:", error);
      setError("Error generating job description.");
      setJobDescription(null); // Clear any previous job description
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Recent Activities Section */}
        <Col xl={2} className="px-2 border-end" style={{ borderRight: '1px solid #ccc' }}>
          <h2 className="text-primary">Recent Activities</h2>
          <ul className="list-unstyled mt-3">
            {activities.map((activity, index) => (
              <li key={index} className="mb-2">{activity}</li>
            ))}
          </ul>
        </Col>

        {/* Prompt Input Section */}
        <Col xl={4} className="px-3">
          <h2 className="text-center text-primary mb-4">Generate Job Description</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="prompt" className="mb-3">
              <Form.Label className="fw-bold">Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the position and tech stack details"
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

        {/* Generated Job Description Section */}
        <Col xl={6} className="px-3">
          {jobDescription ? (
            <Card className="mt-4">
              <Card.Body>
                <Card.Title className="text-primary">Generated Job Description</Card.Title>
                <Card.Text >
                  {jobDescription}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <Alert className="mt-4">
              Generated job description will appear here.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
