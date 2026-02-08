import { useState } from "react";
import { initializeAssignmentSession, generatePage } from "./utils/aiService";
import Paper from "./components/Paper";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [totalPages, setTotalPages] = useState(3);
  const [chatSession, setChatSession] = useState(null);
  const [generatedPages, setGeneratedPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleStart() {
    if (!subject.trim() || !topic.trim()) return;
    setLoading(true);
    try {
      const session = initializeAssignmentSession();
      setChatSession(session);
      const prompt = `Generate page 1 of the assignment. Subject: ${subject}. Topic: ${topic}.`;
      const content = await generatePage(session, prompt);
      setGeneratedPages([{ pageNum: 1, content }]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }

  async function handleNextPage() {
    const nextPageNum = currentPage + 1;
    setCurrentPage(nextPageNum);
    setLoading(true);
    try {
      const prompt = `Generate the next page (page ${nextPageNum}) of the assignment. Subject: ${subject}. Topic: ${topic}. Do not repeat content from previous pages.`;
      const content = await generatePage(chatSession, prompt);
      setGeneratedPages((prev) => [...prev, { pageNum: nextPageNum, content }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    const element = document.getElementById("assignment-pages");
    if (!element) return;

    setIsDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const pages = element.querySelectorAll(".paper-page");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/png");
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Fit image to A4 page
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save("assignment.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">FYCS Assignment Writer</h1>

        {generatedPages.length === 0 ? (
          <>
            <div className="space-y-4 rounded-lg bg-slate-800 p-6">
              <label className="block">
                <span className="text-slate-300 block mb-1">Subject</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
              <label className="block">
                <span className="text-slate-300 block mb-1">Topic</span>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Linked Lists"
                  className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
              <label className="block">
                <span className="text-slate-300 block mb-1">Total Pages</span>
                <input
                  type="number"
                  min={1}
                  value={totalPages}
                  onChange={(e) => setTotalPages(Number(e.target.value) || 3)}
                  className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
            </div>
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
            >
              {loading ? "Starting…" : "Start Writing"}
            </button>
          </>
        ) : (
          <>
            <div id="assignment-pages" className="space-y-6 max-w-full overflow-x-auto">
              {generatedPages.map(({ pageNum, content }) => (
                <div key={pageNum} className="paper-page shadow-xl">
                  <Paper content={content} pageNum={pageNum} />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full py-3 rounded-lg font-medium bg-slate-600 hover:bg-slate-500 text-white transition border border-slate-500 disabled:opacity-50"
            >
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
            {currentPage < totalPages && (
              <button
                onClick={handleNextPage}
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
              >
                {loading ? "Generating…" : "Generate Next Page"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
