import React from "react";

const Modal = ({ onClose, results, data }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Your answers</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-6">
            {results.map((result, i) => (
              <li key={i}>
                <p className="font-medium text-gray-800">{result.q}</p>
                <p
                  className={`p-2 rounded-md mt-2 ${
                    result.a === data[i].answer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  Your answer: {result.a}
                </p>
                {result.a !== data[i].answer && (
                  <p className="p-2 rounded-md mt-2 bg-blue-500 text-white">
                    Correct answer: {data[i].answer}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
