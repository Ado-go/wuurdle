export default function Line({
  word,
  correctWord,
  submited,
}: {
  word: string[];
  correctWord: string;
  submited: boolean;
}) {
  return (
    <div className="flex gap-5">
      {word.map((letter, index) => {
        let bgColor = " bg-white";
        if (submited) {
          if (correctWord.includes(letter)) {
            bgColor =
              correctWord[index] === letter
                ? " bg-green-300"
                : " bg-yellow-300";
          } else {
            bgColor = " bg-gray-300";
          }
        }

        return (
          <div
            className={
              "w-20 h-20 border-2 rounded-lg flex items-center justify-center" +
              bgColor
            }
            key={index}
          >
            <p className="text-xl">{letter}</p>
          </div>
        );
      })}
    </div>
  );
}
