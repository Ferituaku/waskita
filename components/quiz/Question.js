import React, { useState, useEffect, useRef } from 'react';

const Question = ({ data, onAnswerUpdate, numberOfQuestions, activeQuestion, onSetActiveQuestion, onSetStep }) => {
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const radiosWrapper = useRef();

  useEffect(() => {
    const findCheckedInput = radiosWrapper.current.querySelector('input:checked');
    if(findCheckedInput) {
      findCheckedInput.checked = false;
    }
  }, [data]);

  const changeHandler = (e) => {
    setSelected(e.target.value);
    if(error) {
      setError('');
    }
  }
  
  const nextClickHandler = (e) => {
    if(selected === '') {
      return setError('Please select one option!');
    }
    onAnswerUpdate(prevState => [...prevState, { q: data.question, a: selected }]);
    setSelected('');
    if(activeQuestion < numberOfQuestions - 1) {
      onSetActiveQuestion(activeQuestion + 1);
    }else {
      onSetStep(3);
    }
  }

  return(
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
      {/* Pertanyaan */}
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        {data.question}
      </h2>

      {/* Pilihan jawaban */}
      <div className="flex flex-col gap-3" ref={radiosWrapper}>
        {data.choices.map((choice, i) => (
          <label
            key={i}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition hover:bg-blue-50"
          >
            <input
              type="radio"
              name="answer"
              value={choice}
              onChange={changeHandler}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{choice}</span>
          </label>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mt-2 font-medium">{error}</div>
      )}

      {/* Next button */}
      <button
        onClick={nextClickHandler}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition"
      >
        Next
      </button>
    </div>

  );
}

export default Question;