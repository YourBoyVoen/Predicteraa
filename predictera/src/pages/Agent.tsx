import React, { useState } from "react";
import { Send } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

const AgentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 pt-24 md:pt-40 relative">

        {/* Top Bar */}
        <div className="absolute top-6 left-6 md:left-10 flex items-center gap-3 md:hidden">
          <button
            className="p-2 bg-white shadow rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* Main Container */}
        <div className="max-w-4xl mx-auto">

          {/* Title Section */}
          <div className="text-center mb-10 mt-10">
            <h1 className="text-3xl font-bold text-gray-800">
              Ask PredictAgent Anything
            </h1>
            <p className="text-gray-600 mt-2">
              Suggestions of what to ask our Agent
            </p>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Suggestion text="What can I ask you to do?" />
            <Suggestion text="Which one of my projects is performing the best?" />
            <Suggestion text="What projects should I be concerned about right now?" />
          </div>

          {/* Input Section */}
          <div className="w-full bg-white border border-gray-200 shadow rounded-2xl flex items-center px-4 py-3">
            <input
              type="text"
              placeholder="Ask me anything about your projects..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <button className="p-2 rounded-xl hover:bg-blue-500 hover:text-white transition">
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Placeholder for AI Model Output */}
          <div className="mt-10 text-center text-gray-500 text-sm">
            Your AI model output will appear here...
          </div>

        </div>
      </div>
    </div>
  );
};

const Suggestion = ({ text }: { text: string }) => {
  return (
    <button className="px-4 py-2 bg-white rounded-xl text-gray-700 text-sm border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition shadow-sm">
      {text}
    </button>
  );
};

export default AgentPage;
