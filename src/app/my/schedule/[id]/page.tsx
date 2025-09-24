"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  time: string;
  type: "past" | "current" | "future";
}

function ScheduleItem({ item }: { item: ScheduleItem }) {
  const getBorderColor = () => {
    switch (item.type) {
      case "current":
        return "border-pink-500";
      case "past":
        return "border-pink-500";
      case "future":
        return "border-gray-600";
      default:
        return "border-gray-600";
    }
  };

  return (
    <div className={`border-l-4 ${getBorderColor()} pl-4 py-3`}>
      <div className="text-white font-semibold mb-1">{item.title}</div>
      <div className="text-gray-400 text-sm">{item.time}</div>
    </div>
  );
}

export default function SchedulePage() {
  const router = useRouter();
  const scheduleItems: ScheduleItem[] = [
    {
      id: "1",
      date: "07.15",
      title: "Tri-bowl",
      time: "2 p.m.",
      type: "past",
    },
    {
      id: "2",
      date: "07.15",
      title: "Incheon Bridge Observatory",
      time: "4 p.m.",
      type: "past",
    },
    {
      id: "3",
      date: "07.16",
      title: "Salon DOKI",
      time: "10 a.m.",
      type: "future",
    },
    {
      id: "4",
      date: "07.16",
      title: "Studio HYPE",
      time: "1 p.m.",
      type: "future",
    },
    {
      id: "5",
      date: "07.16",
      title: "Urban History Museum",
      time: "5 p.m.",
      type: "future",
    },
  ];

  // Group schedule items by date
  const groupedSchedule = scheduleItems.reduce(
    (groups, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    },
    {} as Record<string, ScheduleItem[]>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </Button>
        <h1 className="text-lg font-bold">Schedule Details</h1>
        <div></div>
      </div>

      {/* Schedule Title */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Futuristic Chic Idol Debut</h2>

        {/* Grouped Schedule List */}
        <div className="space-y-6">
          {Object.entries(groupedSchedule).map(([date, items]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="text-gray-400 text-sm mb-3 font-medium">
                {date}
              </div>

              {/* Schedule Items for this date */}
              <div className="space-y-4">
                {items.map(item => (
                  <ScheduleItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
