import { useState, useEffect } from "react";
import Head from "next/head";
import FileUpload from "../components/FileUpload";
import SummaryEditor from "../components/SummaryEditor";
import EmailForm from "../components/EmailForm";
import {
  Loader2,
  FileText,
  Brain,
  Mail,
  BarChart3,
  Zap,
} from "lucide-react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [customPrompt, setCustomPrompt] = useState(
    "Provide a clear, structured summary of the meeting with key points, decisions made, and action items."
  );
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [summaryHistory, setSummaryHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("summaryHistory");
    if (saved) {
      try {
        setSummaryHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading history:", error);
      }
    }
  }, []);

  const showNotification = (type, message) => {
    alert(message)
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      showNotification(
        "error",
        "Please upload or paste a meeting transcript first."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcript.trim(),
          customPrompt: customPrompt.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);

      const newSummary = {
        id: Date.now(),
        transcript:
          transcript.length > 100
            ? transcript.substring(0, 100) + "..."
            : transcript,
        summary: data.summary,
        createdAt: new Date().toISOString(),
        prompt: customPrompt,
      };
      const updatedHistory = [newSummary, ...summaryHistory.slice(0, 9)];
      setSummaryHistory(updatedHistory);
      localStorage.setItem("summaryHistory", JSON.stringify(updatedHistory));

      showNotification("success", "Summary generated successfully!");
    } catch (error) {
      showNotification("error", `Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async (emailData) => {
    if (!summary.trim()) {
      showNotification("error", "Please generate a summary first.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...emailData,
          summary: summary.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      showNotification(
        "success",
        `Email sent successfully to ${emailData.recipients.length} recipient(s)!`
      );
    } catch (error) {
      showNotification("error", `Email error: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const loadHistoryItem = (item) => {
    setSummary(item.summary);
    setCustomPrompt(item.prompt);
    showNotification("success", "Summary loaded from history");
  };

  return (
    <>
      <Head>
        <title>AI Meeting Notes Summarizer</title>
        <meta
          name="description"
          content="Transform your meeting transcripts into actionable summaries"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary p-3 mb-3">
              <Zap className="text-white" size={32} />
            </div>
            <h1 className="fw-bold text-dark">
              AI Meeting Notes Summarizer
            </h1>
            <p className="lead text-muted">
              Transform your meeting transcripts into actionable summaries and
              share them instantly via email
            </p>
          </div>

          <div className="row g-4">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Step 1: Upload */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">
                    <FileText size={18} className="me-2 text-primary" />
                    Upload Meeting Transcript
                  </h5>
                  <p className="text-muted small">
                    Start by uploading your meeting transcript or paste it
                    directly
                  </p>
                  <FileUpload
                    onTranscriptChange={setTranscript}
                    transcript={transcript}
                  />
                </div>
              </div>

              {/* Step 2: Custom Instructions */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">
                    <Brain size={18} className="me-2 text-purple" />
                    Summarization Instructions
                  </h5>
                  <p className="text-muted small">
                    Tell the AI how you want your meeting summarized
                  </p>

                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="form-control mb-3"
                    rows={4}
                  />

                  <div className="row g-2">
                    {[
                      {
                        label: "Executive Summary",
                        prompt:
                          "Summarize in bullet points for executives with key decisions and action items.",
                        icon: "👔",
                      },
                      {
                        label: "Action Items Only",
                        prompt:
                          "Extract only action items with responsible parties and deadlines.",
                        icon: "✅",
                      },
                      {
                        label: "Detailed Recap",
                        prompt:
                          "Create a detailed meeting recap with all discussions, decisions, and next steps.",
                        icon: "📋",
                      },
                      {
                        label: "Key Takeaways",
                        prompt:
                          "Highlight the most important takeaways and decisions from the meeting.",
                        icon: "🎯",
                      },
                    ].map((template) => (
                      <div className="col-sm-6 col-lg-3" key={template.label}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary w-100"
                          onClick={() => setCustomPrompt(template.prompt)}
                        >
                          <div className="fs-5">{template.icon}</div>
                          <div className="fw-semibold small">
                            {template.label}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Generate */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <button
                    onClick={generateSummary}
                    disabled={isGenerating || !transcript.trim()}
                    className="btn btn-primary w-100 btn-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="me-2 spinner-border" />
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <Brain size={20} className="me-2" />
                        Generate AI Summary
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 4: Edit Summary */}
              {summary && (
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <FileText size={18} className="me-2 text-success" />
                      Generated Summary
                    </h5>
                    <p className="text-muted small">
                      Review and edit your AI-generated summary
                    </p>
                    <SummaryEditor
                      summary={summary}
                      onSummaryChange={setSummary}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Send Email */}
              {summary && (
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Mail size={18} className="me-2 text-info" />
                      Share via Email
                    </h5>
                    <p className="text-muted small">
                      Send the summary to your team members
                    </p>
                    <EmailForm onSendEmail={sendEmail} isSending={isSending} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Quick Stats */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">
                    <BarChart3 size={18} className="me-2 text-primary" />
                    Quick Stats
                  </h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Transcript</span>
                      <strong>{transcript.length.toLocaleString()}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Summary</span>
                      <strong>{summary.length.toLocaleString()}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Compression</span>
                      <strong>
                        {transcript.length > 0
                          ? Math.round((summary.length / transcript.length) * 100)
                          : 0}
                        %
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Summary History */}
              {summaryHistory.length > 0 && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">
                      Recent Summaries
                    </h6>
                    <div
                      className="overflow-auto"
                      style={{ maxHeight: "300px" }}
                    >
                      {summaryHistory.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded p-2 mb-2 bg-light cursor-pointer"
                          onClick={() => loadHistoryItem(item)}
                        >
                          <div className="d-flex justify-content-between small text-muted">
                            <span>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="badge bg-primary">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="small text-dark mb-2">
                            {item.transcript}
                          </div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadHistoryItem(item);
                            }}
                          >
                            Load Summary
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
