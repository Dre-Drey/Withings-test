import { sentence } from "case"; // yarn library to clean case (to display clean category name)
import classnames from "classnames"; //yarn library to clean classnames
import React, { useState, useEffect } from "react";
import { difficultyModifier } from "./App";

// shuffle from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const Question = ({ question, nextQuestion, isLastQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null); // DONE: states to select answer
  const [showResult, setShowResult] = useState(false); // DONE: states to show result
  const [shownAnswers, setShownAnswers] = useState([]); //DONE: states to show corrrect and incorret answers

  useEffect(() => {
    setShownAnswers(
      shuffle([question.correctAnswer, ...question.incorrectAnswers])
    );
  }, []);
  let nextStepText = "Validate";
  if (!isLastQuestion && showResult) {
    nextStepText = "Next question";
  }
  if (isLastQuestion && showResult) {
    nextStepText = "See result";
  }
  return (
    <div className="question-container">
      <p className="description">
        Category : {sentence(question.category)} - Difficulty :{" "}
        {question.difficulty}{" "}
      </p>
      <p className="question">{question.question.text}</p>
      <div className="question-answers">
        {shownAnswers.map((answer) => (
          <button
            className={classnames({
              selected: selectedAnswer === answer,
              correctAnswer: showResult && answer === question.correctAnswer,
              incorrectAnswer:
                selectedAnswer === answer &&
                showResult &&
                question.incorrectAnswers.includes(answer),
            })}
            onClick={() => setSelectedAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
      <div className="question-validate">
        <button
          disabled={!selectedAnswer}
          onClick={() => {
            if (!showResult) {
              setShowResult(true);
              return;
            }
            let scoreModifier = 0;
            if (selectedAnswer === question.correctAnswer) {
              scoreModifier = difficultyModifier[question.difficulty];
            }
            nextQuestion(scoreModifier);
          }}
        >
          {nextStepText}
        </button>
      </div>
    </div>
  );
};

export default Question;
