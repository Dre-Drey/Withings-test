import React, { useState, useEffect } from "react";
import Question from "./Question";
import Result from "./Result";

const fetchQuestions = async () => {
  // DONE : API call from Trivia with async function
  return await (
    await fetch("https://the-trivia-api.com/v2/questions?limit=5")
  ).json();
};

export const difficultyModifier = {
  //DONE : create an object to stock the difficulty of each question and the score linked
  easy: 1,
  medium: 2,
  hard: 3,
};

const App = () => {
  const [questions, setQuestions] = useState([]); //create a state for the questions
  const [currentQuestion, setCurrentQuestion] = useState(0); //create a state for the current question
  const [score, setScore] = useState(0); //create a state for the score (get and stock the number of points according to the difficulty)

  useEffect(async () => {
    setQuestions(await fetchQuestions());
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <h1>Quiz</h1>
        {/* Displaying the current score with the state score */}
        <h2>Current score : {score}</h2>
      </div>

      <div className="App-content">
        {currentQuestion > 4 ? ( // if the question was the fifth, displaying the score card (result component), else the question component
          <>
            <Result //the result component pass the followings props: score and maxscore
              score={score}
              maxScore={questions.reduce(
                (maxScore, question) =>
                  maxScore + difficultyModifier[question.difficulty],
                0
              )}
            />
          </>
        ) : (
          <>
            {questions.length > 0 && ( //security check
              <Question //the question component pass the followings props :
                isLastQuestion={currentQuestion === 4} //to know if we have to change the name of the button from "next question" to "see result"
                key={currentQuestion} //to preserve the state of the answers when shuffle
                question={questions[currentQuestion]} //to display the question
                nextQuestion={(scoreModifier) => {
                  //to keep track of the score and get the next question
                  setScore(score + scoreModifier);
                  setCurrentQuestion(currentQuestion + 1);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
