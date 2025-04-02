export default function Line({
  word,
  tilesColor,
}: {
  word: string[];
  tilesColor: string[];
}) {
  return (
    <div className="flex gap-5">
      {word.map((letter, index) => {
        return (
          <div
            className={
              "w-20 h-20 border-2 rounded-lg flex items-center justify-center transition-colors duration-500 ease-in-out " +
              "bg-" +
              tilesColor[index]
            }
            key={index}
          >
            <p className="text-xl">{letter.toUpperCase()}</p>
          </div>
        );
      })}
    </div>
  );
}
