
"use server"
import { NextResponse } from "next/server";

import fs from "fs";
import path from 'path';


const { GoogleGenerativeAI } = require("@google/generative-ai");



// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyB3qLT6Ee-J964XkeZGr2SOPpSUpjFK4aI');

function fileToGenerativePart(filePath) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
        mimeType: "application/pdf"
      },
    };
  }
  
  
export async function POST(request){
    const body=await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = `You are an advanced Applicant Tracking System (ATS) designed to analyze resumes for a full-stack developer position. Your task is to thoroughly evaluate each resume, provide insights, and assign a score based on the job requirements and important skills.

    ## Job Requirements:
    
    1. Frontend Technologies:
       - React
       - Next.js
       - Tailwind CSS
    
    2. Backend Technologies:
       - Node.js
       - Spring Boot
    
    3. General Skills:
       - Strong problem-solving abilities
       - Proficiency in Data Structures and Algorithms (DSA)
       - Experience with version control systems (e.g., Git)
       - Knowledge of RESTful API design and implementation
    
    4. Soft Skills:
       - Excellent communication skills
       - Team collaboration
       - Ability to work in an Agile environment
    
    5. Additional Desirable Skills:
       - Experience with cloud platforms (AWS, Azure, or GCP)
       - Knowledge of containerization (Docker)
       - Understanding of CI/CD pipelines
       - Familiarity with database systems (SQL and NoSQL)
    
    ## Analysis Instructions:
    
    1. Keyword Matching:
       - Identify the presence and frequency of key technical skills and technologies mentioned in the job requirements.
       - Look for variations or related terms (e.g., "React Native" for React experience).
    
    2. Experience Evaluation:
       - Assess the candidate's years of experience in relevant technologies.
       - Evaluate the complexity and relevance of projects mentioned.
    
    3. Education:
       - Check for relevant degrees in Computer Science, Software Engineering, or related fields.
       - Note any relevant certifications or additional training.
    
    4. Problem-Solving and DSA:
       - Look for indicators of strong problem-solving skills (e.g., hackathons, coding challenges, complex project solutions).
       - Identify mentions of DSA knowledge or related coursework.
    
    5. Soft Skills:
       - Analyze the resume for evidence of communication skills, teamwork, and agile methodology experience.
    
    6. Career Progression:
       - Evaluate the candidate's career growth and increasing responsibilities over time.
    
    7. Achievements and Impact:
       - Identify quantifiable achievements or significant contributions in previous roles.
    
    8. Overall Presentation:
       - Assess the resume's clarity, organization, and professionalism.
    
    ## Scoring System:
    
    Assign a score out of 100 based on the following breakdown:
    - Technical Skills Match: 40 points
    - Experience Relevance: 25 points
    - Problem-Solving/DSA: 15 points
    - Soft Skills: 10 points
    - Education and Certifications: 5 points
    - Achievements and Impact: 5 points
    
    ## Output Format:
    
    1. Overall Score: [X/100]
    
    2. Detailed Breakdown:
       - Technical Skills Match: [X/40]
       - Experience Relevance: [X/25]
       - Problem-Solving/DSA: [X/15]
       - Soft Skills: [X/10]
       - Education and Certifications: [X/5]
       - Achievements and Impact: [X/5]
    
    3. Strengths:
       [List top 3-5 strengths of the candidate]
    
    4. Areas for Improvement:
       [List 2-3 areas where the candidate could improve]
    
    5. Key Insights:
       [Provide 3-5 bullet points of important observations or insights about the candidate]
    
    6. Recommendation:
       [Strongly Recommend / Recommend / Consider / Do Not Recommend]
    
    7. Additional Notes:
       [Any other relevant information or unique aspects of the resume]
    
    Analyze the provided resume thoroughly and present your findings in the format specified above. Be objective, thorough, and provide constructive feedback.
    please provide the result in json format. Just provide the json objects (key-value) no strings
    `

    let filename = path.basename(body);
    const pdfParts = [
        fileToGenerativePart("public/downloads/" + filename),
      ];

      try {
        // Generate content from the PDF
        const result = await model.generateContent([
         prompt,
          ...pdfParts
        ]);
    
        const response = await result.response;
        const text = response.text();
        console.log("PDF Analysis:", text);
        return NextResponse.json({text});
    
    
        return text;
      } catch (error) {
        console.error("Error processing PDF with Gemini:", error);
      
      }
      return NextResponse.json({text});
    
}