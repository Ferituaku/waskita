// Start.js
import React from "react";

const Start = ({ onQuizStart }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Start the Quiz</h1>
        <p className="text-gray-600 mb-6">Good luck! Let's test your knowledge.</p>
        <button
          onClick={onQuizStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default Start;
