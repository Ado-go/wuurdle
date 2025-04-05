export default function Toast({ text }: { text: string }) {
  return (
    <div className="flex mt-20  items-center sm:h-10 p-2 absolute bg-gray-800 rounded-2xl select-none">
      <p className="pl-5 pr-5 text-white text-center">{text}</p>
    </div>
  );
}
