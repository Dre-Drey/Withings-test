import React, { useState, useEffect } from "react";

const Result = ({ score, maxScore }) => {
  return (
    <div>
      <p> Your score : {score}</p>
      <p> Max score : {maxScore}</p>
    </div>
  );
};

export default Result;
