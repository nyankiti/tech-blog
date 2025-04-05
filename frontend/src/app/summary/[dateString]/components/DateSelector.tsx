"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import LoadingOverlay from "./LoadingOverlay";

type Props = {
  currentDate: string;
  summaryDates: string[];
};

export default function DateSelector({ currentDate, summaryDates }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isChangingDate, setIsChangingDate] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = e.target.value;
    setIsChangingDate(true);

    // useTransitionでルーティング更新をラップしてUIのブロッキングを防止
    startTransition(() => {
      router.push(`/summary/${newDate}`);
    });
  };

  return (
    <div className="date-selector mb-6 relative">
      {(isPending || isChangingDate) && <LoadingOverlay />}
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
        onChange={handleDateChange}
        disabled={isPending || isChangingDate}
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
