import { LetterColor } from "../App";

export default function Keyboard({
  usedLetters,
  handleKeyClick,
}: {
  usedLetters: { [key: string]: LetterColor };
  handleKeyClick: (letter: string) => void;
}) {
  const letterRows = ["qwertyuiop", "asdfghjkl", "0zxcvbnm1"];
  const colors = {
    "green-300": "bg-green-300",
    "yellow-300": "bg-yellow-300",
    "gray-400": "bg-gray-400",
  };

  return (
    <div>
      {letterRows.map((row) => {
        return (
          <div className="flex gap-2 justify-center" key={row}>
            {row.split("").map((letter) => {
              return (
                <div
                  onClick={() => handleKeyClick(letter)}
                  key={letter}
                  className={`h-10 p-4 pb-10 mb-2 rounded-xl select-none transition-colors duration-500 ease-in-out ${
                    usedLetters[letter]
                      ? `${colors[usedLetters[letter]]}`
                      : "bg-gray-200"
                  } hover:bg-gray-300 cursor-pointer`}
                >
                  <p>
                    {letter === "0"
                      ? "Enter"
                      : letter === "1"
                      ? "Delete"
                      : letter}
                  </p>
                </div>
              );
            })}
            <br className="select-none" />
          </div>
        );
      })}
    </div>
  );
}
