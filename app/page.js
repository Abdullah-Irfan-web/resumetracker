
"use client"
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Home() {

  const [imageId, setImagePublicId] = useState("");
  const [atsResult, setAtsResult] = useState(null);

  const openWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dac2viawa",
        uploadPreset: "wkhqhjpw"
      },
      async (error, result) => {
        if (result.event === "success") {
          setImagePublicId(`https://res.cloudinary.com/dac2viawa/image/upload/v${result.info.version}/${result.info.public_id}.${result.info.format}`);

          const response = await fetch(`/api/dwld`, {
            method: 'POST',
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(`https://res.cloudinary.com/dac2viawa/image/upload/v${result.info.version}/${result.info.public_id}.${result.info.format}`)
          });

          const d = await response.json();
          if (response.ok) {
            console.log('Image downloaded successfully!');
          }
        } else {
          console.log(error);
        }
      }
    );
    widget.open();
  };

  const cleanAndParseJsonString = (responseString) => {
    // Remove the backticks and "```json" from the start and the ending "```"
    let jsonString = JSON.parse(responseString).text;

    // Step 2: Remove unwanted artifacts like ```json and ``` 
    jsonString = jsonString.replace(/```json|```/g, '');
    
    // Step 3: Parse the cleaned string as JSON
    const parsedJson = JSON.parse(jsonString);
    console.log(parsedJson);
    try {
      return parsedJson;  // Parse the cleaned string
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  };

  const search = async () => {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(imageId)
    });

    const resText = await response.text();  // Fetch the response as a string
    const parsedJson = cleanAndParseJsonString(resText);  // Clean and parse the JSON
    if (parsedJson) {
      setAtsResult(parsedJson);  // Set the parsed result in the state
    }
  };

  return (
    <div className="min-h-screen bg-teal-700 text-white p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">LiveCareer</h1>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">Builders</a>
          <a href="#" className="hover:underline">Resumes</a>
          <a href="#" className="hover:underline">CV</a>
          <a href="#" className="hover:underline">Cover Letters</a>
          <a href="#" className="hover:underline">Resources</a>
        </nav>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-5xl font-bold mb-6">ATS Resume Checker: Review, score & improve your resume</h2>
          <button onClick={openWidget} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Upload your Resume
          </button>
          {imageId && 
            <button onClick={search} className="bg-orange-500 ml-4 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Rate My Resume
            </button>
          }
        </div>
        <div className="md:w-1/2 bg-white text-teal-700 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">95</div>
            <div className="text-right">
              <div className="font-bold">GOOD WORK!</div>
              <div>RESUME STRENGTH</div>
            </div>
          </div>
          <p className="mb-4">Review our suggestions to see what you can fix.</p>
          <ul className="space-y-2">
            <li className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Completeness</li>
            <li className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Word Choice</li>
            <li className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Typos</li>
          </ul>
          <p className="mt-4 text-sm">Files we can read: DOC, DOCX, PDF, HTML, RTF, TXT</p>
        </div>

       
      </main>
      {atsResult && (
          <div className=" bg-white text-teal-700 p-6 rounded-lg mt-8 shadow-lg">
            <h3 className="text-4xl font-bold mb-4">Resume Analysis</h3>
            <div className="mb-4">
              <div className="font-bold text-2xl">Overall Score: {atsResult["Overall Score"]}</div>
            </div>
            <div className='flex '>
              <div>
            <div>
            <h4 className="text-xl font-bold mb-2">Detailed Breakdown</h4>
            <ul className="space-y-2">
              {Object.entries(atsResult["Detailed Breakdown"]).map(([key, value]) => (
                <li key={key} className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> {key}: {value}</li>
              ))}
            </ul>
            </div>
            <div>
            <h4 className="text-xl font-bold mt-4 mb-2">Strengths</h4>
            <ul className="space-y-2">
              {atsResult.Strengths.map((strength, index) => (
                <li key={index} className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> {strength}</li>
              ))}
            </ul>
            </div>
            </div>
            <div>
                <div>
            <h4 className="text-xl font-bold mt-4 mb-2">Areas for Improvement</h4>
            <ul className="space-y-2">
              {atsResult["Areas for Improvement"].map((area, index) => (
                <li key={index} className="flex items-center"><CheckCircle className="text-yellow-500 mr-2" /> {area}</li>
              ))}
            </ul>
</div>

<div>
            <h4 className="text-xl font-bold mt-4 mb-2">Key Insights</h4>
            <ul className="space-y-2">
              {atsResult["Key Insights"].map((insight, index) => (
                <li key={index} className="flex items-center"><CheckCircle className="text-blue-500 mr-2" /> {insight}</li>
              ))}
            </ul>
            </div>
            </div>
</div>
            <div className="mt-4">
              <strong>Recommendation:</strong> {atsResult.Recommendation}
            </div>
            <div className="mt-2">
              <strong>Additional Notes:</strong> {atsResult["Additional Notes"]}
            </div>
          </div>
        )}
    </div>
  );
            
}
