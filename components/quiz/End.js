import React, { useEffect, useState } from "react";
import { formatTime } from "../utils";

const End = ({ results, data, onReset, onAnswersCheck, time }) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    let correct = 0;
    results.forEach((result, index) => {
      if (result.a === data[index].answer) {
        correct++;
      }
    });
    setCorrectAnswers(correct);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 max-w-lg w-full mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Your results</h3>

      <p className="text-lg">
        {correctAnswers} of {data.length}
      </p>
      <p className="text-lg font-bold text-blue-600">
        {Math.floor((correctAnswers / data.length) * 100)}%
      </p>
      <p className="text-gray-700">
        <strong>Your time:</strong> {formatTime(time)}
      </p>

      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={onAnswersCheck}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Check your answers
        </button>
        <button
          onClick={onReset}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default End;
