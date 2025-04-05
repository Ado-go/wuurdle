export default function Keyboard({
  handleKeyClick,
}: {
  handleKeyClick: (letter: string) => void;
}) {
  const letterRows = ["qwertyuiop", "asdfghjkl", "0yxcvbnm1"];

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
                  className="h-10 p-4 pb-10 mb-2 rounded-xl bg-gray-200 hover:bg-gray-300 cursor-pointer"
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
            <br />
          </div>
        );
      })}
    </div>
  );
}
