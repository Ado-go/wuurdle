import { useState, useEffect, useMemo } from "react";
import "./App.css";

import Line from "./components/Line";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const WORD_API = "https://random-word-api.herokuapp.com/word?length=5";
const WORD_EXIST_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const fetchValidWord = async (): Promise<string> => {
  while (true) {
    const wordRes = await fetch(WORD_API);
    const wordData = await wordRes.json();
    const word = wordData[0];

    const existRes = await fetch(WORD_EXIST_API + word);
    const existData = await existRes.json();

    if (Array.isArray(existData)) {
      console.log(word);
      return word;
    }
  }
};

function App() {
  const queryClient = useQueryClient();
  const [gameOver, setGameOver] = useState(false);
  const [guesses, setGuesses] = useState(Array(6).fill(Array(5).fill("")));

  const [tilesColors, setTilesColors] = useState(
    Array(6).fill(Array(5).fill("white"))
  );

  const [guessIndex, setGuessIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [allowType, setAllowType] = useState(true);
  const { data: WORD, isLoading: isLoadingWord } = useQuery({
    queryFn: fetchValidWord,
    queryKey: ["word"],
    refetchOnWindowFocus: false,
  });

  const handleResest = () => {
    setGuesses(Array(6).fill(Array(5).fill("")));
    setTilesColors(Array(6).fill(Array(5).fill("white")));
    setGuessIndex(0);
    setLetterIndex(0);
    setAllowType(true);
    setGameOver(false);
    queryClient.invalidateQueries(["words"]);
  };

  const lettersFrequency = useMemo(() => {
    if (!WORD) return {};
    const result: { [key: string]: number } = {};
    if (!isLoadingWord) {
      for (const char of WORD) {
        result[char] = (result[char] || 0) + 1;
      }
    }
    return result;
  }, [WORD, isLoadingWord]);

  useEffect(() => {
    const colorTiles = () => {
      if (!WORD) return;
      const newColorTiles = [...tilesColors];
      const newColorTile = [...newColorTiles[guessIndex]];

      const guessLettersFreguency: { [key: string]: number } = {};
      for (let i = 0; i < newColorTile.length; i++) {
        if (WORD[i] === guesses[guessIndex][i]) {
          guessLettersFreguency[WORD[i]] =
            (guessLettersFreguency[WORD[i]] || 0) + 1;
          newColorTile[i] = "green-300";
        }
      }

      for (let i = 0; i < newColorTile.length; i++) {
        if (newColorTile[i] === "green-300") continue;
        if (WORD.includes(guesses[guessIndex][i])) {
          if (
            lettersFrequency[guesses[guessIndex][i]] >
            (guessLettersFreguency[guesses[guessIndex][i]] || 0)
          ) {
            guessLettersFreguency[guesses[guessIndex][i]] =
              (guessLettersFreguency[guesses[guessIndex][i]] || 0) + 1;
            newColorTile[i] = "yellow-300";
          } else {
            newColorTile[i] = "gray-300";
          }
        } else {
          newColorTile[i] = "gray-300";
        }
      }
      newColorTiles[guessIndex] = newColorTile;
      setTilesColors(newColorTiles);
    };

    const checkGuess = () => {
      colorTiles();
      if (guesses[guessIndex].join("") === WORD) {
        setAllowType(false);
        setGameOver(true);
        alert("You win");
      } else if (guessIndex === 5) {
        alert("You lost, word was: " + WORD);
        setGameOver(true);
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
        newActualGuess[letterIndex] = e.key.toLowerCase();
        newGuesses[guessIndex] = newActualGuess;
        setGuesses(newGuesses);
        setLetterIndex((prev) => prev + 1);
      } else if (e.key === "Enter") {
        const WORD_TO_CHECK = guesses[guessIndex].join("");
        queryClient
          .fetchQuery({
            queryKey: ["exist", WORD_TO_CHECK],
            queryFn: async () => {
              const res = await fetch(WORD_EXIST_API + WORD_TO_CHECK);
              return res.json();
            },
          })
          .then((data) => {
            if (Array.isArray(data)) {
              checkGuess();
              if (guessIndex < 5) {
                setGuessIndex((prev) => prev + 1);
                setLetterIndex(0);
              }
            } else {
              alert("That word does not exist or at least I do not know it");
            }
          });
      }
    };

    document.addEventListener("keydown", typeWord);
    return () => document.removeEventListener("keydown", typeWord);
  }, [
    WORD,
    allowType,
    guessIndex,
    guesses,
    lettersFrequency,
    letterIndex,
    queryClient,
    tilesColors,
  ]);

  if (isLoadingWord) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center mt-5 p-10 gap-5">
        <h1 className="text-5xl font-sans">WUURDLE</h1>
        {guesses.map((guess, index) => (
          <Line key={index} word={guess} tilesColor={tilesColors[index]} />
        ))}
        {gameOver && (
          <button
            className="cursor-pointer border-2 p-5 rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-200"
            onClick={() => handleResest()}
          >
            NEW WORD
          </button>
        )}
      </div>
    </>
  );
}

export default App;
