export default function Card({ children }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow w-full">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
