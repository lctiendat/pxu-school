import React, { useState } from "react";
import dayjs from "dayjs";
import { IonIcon } from "@ionic/react";

function Calendar() {
    const [month, setMonth] = useState(dayjs().month());
    const [year, setYear] = useState(dayjs().year());

    const daysInMonth = dayjs(`${year}-${month + 1}-01`).daysInMonth();
    const startDayOfWeek = dayjs(`${year}-${month + 1}-01`).day();

    const absentDays = [8, 23];
    const holidayDays = [20];

    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const isAbsent = absentDays.includes(i);
            const isHoliday = holidayDays.includes(i);
            let dayClass = "text-gray-800";

            if (isAbsent) dayClass = "bg-red-500 text-white rounded-full";
            if (isHoliday) dayClass = "bg-green-500 text-white rounded-full";

            days.push(
                <div
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center ${dayClass}`}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm">            {/* Phần header */}
                <div className="bg-gradient-to-b from-blue-500 to-blue-600 p-4 pt-8 rounded-b-3xl flex items-center justify-between">
                    <IonIcon icon="arrow-back-outline" className="text-white text-2xl" />
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-700 text-white rounded-full">Attendance</button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full">Holiday</button>
                    </div>
                </div>

                {/* Phần lịch */}
                <div className="bg-white rounded-3xl shadow p-6 mt-4 mx-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <IonIcon icon="chevron-back-outline" className="text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-800">{dayjs().month(month).format("MMMM YYYY")}</h2>
                        <IonIcon icon="chevron-forward-outline" className="text-gray-600" />
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-gray-600 font-medium">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                            <div key={day} className="text-xs">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 mt-2 text-center">
                        {Array(startDayOfWeek).fill(<div />)}
                        {renderDays()}
                    </div>
                </div>

                {/* Phần trạng thái */}
                <div className="mt-4 mx-4 space-y-2">
                    <div className="flex items-center justify-between p-4 bg-red-100 rounded-lg border-l-4 border-red-500">
                        <span className="text-gray-700">Absent</span>
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">02</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
                        <span className="text-gray-700">Festival & Holidays</span>
                        <span className="bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">01</span>
                    </div>
                </div>

                {/* Trang trí cuối */}
                <div className="mt-6 bg-white h-24 rounded-t-3xl flex items-center justify-center space-x-4">
                    <IonIcon icon="book-outline" className="text-blue-500 text-2xl" />
                    <IonIcon icon="school-outline" className="text-blue-500 text-2xl" />
                    <IonIcon icon="happy-outline" className="text-blue-500 text-2xl" />
                </div>
            </div>
        </div>
    );
}

export default Calendar;
