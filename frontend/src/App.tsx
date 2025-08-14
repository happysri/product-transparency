import React, { useState } from "react";

interface QuestionResponse {
  questions: string[];
}

function App() {
  const [step, setStep] = useState(1);
  const [productName, setProductName] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Fetch questions from AI service via backend
  const fetchQuestions = async () => {
    if (!productName) {
      alert("Please enter a product name.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: productName }),
      });

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data: QuestionResponse = await res.json();
      setQuestions(data.questions);
      setStep(2); // move to question step
    } catch (error) {
      console.error(error);
      alert("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  // Update answers
  const handleAnswerChange = (q: string, value: string) => {
    setAnswers({ ...answers, [q]: value });
  };

  // Submit answers + request PDF
  const handleSubmit = async () => {
    try {
      // Save product to backend
      await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          description: "Submitted via form",
          answers,
        }),
      });

      // Generate PDF report
      const res = await fetch("http://localhost:8000/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, answers }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      // Download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productName}_report.pdf`;
      a.click();
      a.remove();

      alert("Report downloaded successfully!");
      setStep(1); // reset to first step
      setProductName("");
      setAnswers({});
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert("Error submitting product");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Product Transparency Form</h1>

      {/* Step 1: Product Name */}
      {step === 1 && (
        <div>
          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
          />
          <button onClick={fetchQuestions} disabled={loading}>
            {loading ? "Loading..." : "Generate Questions"}
          </button>
        </div>
      )}

      {/* Step 2: Answer Questions */}
      {step === 2 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Follow-up Questions</h2>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <label>{q}</label>
              <input
                type="text"
                value={answers[q] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value)}
                style={{ padding: "8px", width: "100%" }}
              />
            </div>
          ))}
          <button
            style={{ marginTop: "10px", padding: "10px 20px" }}
            onClick={handleSubmit}
          >
            Submit & Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
