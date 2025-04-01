import { useState, useEffect } from "react";
import "./App.css";

import Line from "./components/Line";
import { useQuery } from "@tanstack/react-query";

const WORD_API = "https://random-word-api.herokuapp.com/word?length=5";

function App() {
  const [guesses, setGuesses] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [guessIndex, setGuessIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [allowType, setAllowType] = useState(true);
  const { data: WORD, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fetch(WORD_API);
      return res.json();
    },
    queryKey: ["word"],
  });

  useEffect(() => {
    const checkGuess = () => {
      if (guesses[guessIndex].join("") === WORD[0].toUpperCase()) {
        setAllowType(false);
        alert("You win");
      } else if (guessIndex === 5) {
        alert("You lost, word was: " + WORD[0].toUpperCase());
      }
    };

    const typeWord = (e: KeyboardEvent) => {
      if (e.repeat || guessIndex > 5 || !allowType) return;
      if (e.key === "Backspace") {
        if (letterIndex === 0) return;
        const newGuesses = [...guesses];
        const newActualGuess = [...newGuesses[guessIndex]];
        newActualGuess[letterIndex - 1] = "";
        newGuesses[guessIndex] = newActualGuess;
        setGuesses(newGuesses);
        setLetterIndex((prev) => prev - 1);
      } else if (letterIndex < 5) {
        if (!/^[a-zA-Z]$/.test(e.key)) return;
        const newGuesses = [...guesses];
        const newActualGuess = [...newGuesses[guessIndex]];
        newActualGuess[letterIndex] = e.key.toUpperCase();
        newGuesses[guessIndex] = newActualGuess;
        setGuesses(newGuesses);
        setLetterIndex((prev) => prev + 1);
      } else if (e.key === "Enter") {
        checkGuess();
        setGuessIndex((prev) => prev + 1);
        setLetterIndex(0);
      }
    };

    document.addEventListener("keydown", typeWord);
    return () => document.removeEventListener("keydown", typeWord);
  }, [allowType, guessIndex, guesses, letterIndex]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center mt-5 p-10 gap-5">
        <h1 className="text-5xl font-sans">WUURDLE</h1>
        {guesses.map((guess, index) => (
          <Line
            key={index}
            correctWord={WORD[0].toUpperCase()}
            word={guess}
            submited={guessIndex > index}
          />
        ))}
      </div>
    </>
  );
}

export default App;
