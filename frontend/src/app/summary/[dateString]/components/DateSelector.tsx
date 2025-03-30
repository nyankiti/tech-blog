"use client";

type Props = {
  currentDate: string;
  summaryDates: string[];
};

export default function DateSelector({ currentDate, summaryDates }: Props) {
  return (
    <div className="date-selector mb-6">
      <label
        htmlFor="date-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        日付を選択
      </label>
      <select
        id="date-select"
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={currentDate}
        onChange={(e) => {
          window.location.href = `/summary/${e.target.value}`;
        }}
      >
        {summaryDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
}
