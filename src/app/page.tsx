"use client"
import { useState } from "react";
import { GEMINI_API_KEY } from "@/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
const Home =() => {
  const [prompt , setPrompt] = useState<string>("")
  const [jobDescription, setJobDescription] = useState<string>("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);

     
    } catch (error) {
      console.error("Error generating job description:", error);
      setJobDescription("Error generating job description.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Generate Job Description</h1>
      <label htmlFor="prompt">Prompt:</label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button type="submit">Generate</button>
     {
        jobDescription && (
          <div>
            <h2>Generated Job Description</h2>
            <p>{jobDescription}</p>
          </div>
        )
     }
    </form>
  );
};

export default Home;
