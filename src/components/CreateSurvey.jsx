import React, { useState } from "react";
import { db } from "./../firebase.jsx";
import { collection, addDoc } from "firebase/firestore";

function CreateSurvey() {

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  // const [options, setOptions] = useState(["", ""]); 

  // const handleOptionChange = (index, value) => {
  //   const newOptions = options.map((option, i) => {
  //     if (i === index) {
  //       return value;
  //     }
  //     return option;
  //   });
  //   setOptions(newOptions);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "surveys"), {
        title,
        question,
        options,
      });
      alert("Survey created successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Survey Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        Question:
        <input
          type="text"
          value={option}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </label>
{/* 
      {options.map((option, index) => (
        <label key={index}>
          Option {index + 1}:
          <input
          type='text'
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          </label>

      ))} */}

      <button type="submit">Create Survey</button>
    </form>
  );
}

export default createSurvey;
