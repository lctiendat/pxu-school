import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
    personOutline,
    schoolOutline,
    walletOutline,
    gameControllerOutline,
    documentTextOutline,
    calendarOutline,
    timeOutline,
    fileTrayFullOutline,
    clipboardOutline,
    helpCircleOutline,
    imagesOutline,
    documentLockOutline,
    lockClosedOutline,
    calendarNumberOutline,
    logOutOutline,
    homeOutline,
    notificationsOutline,
} from "ionicons/icons";

export default function Dashboard() {
    return (
        <div className="flex justify-center h-screen bg-gray-100">
            {/* Phần nền trên */}
            <div className="w-full bg-white">
                <div className="bg-gradient-to-b from-red-600 to-red-700 p-5 rounded-b-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-white">Hi, @lctiendat</h1>
                            <p className="text-white text-sm opacity-75">IT220020 | Công nghệ thông tin</p>
                        </div>
                        {/* Avatar placeholder */}
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    </div>
                    <button className="mt-4 text-xs bg-blue-200 text-blue-800 py-1 px-3 rounded-full">
                        2022-2025
                    </button>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-2 rounded-xl shadow flex flex-col items-center">
                            <IonIcon icon={schoolOutline} className="text-yellow-500 text-xl" />
                            <p className="text-md font-bold mt-2 text-black">3.6/ 4.0</p>
                            <p className="text-gray-600 text-xs">Điểm tích luỹ</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow flex flex-col items-center">
                            <IonIcon icon={walletOutline} className="text-pink-500 text-xl" />
                            <p className="text-md font-bold mt-2 text-black">1.000.000</p>
                            <p className="text-gray-600">Công nợ</p>
                        </div>
                    </div>
                </div>

                {/* Lưới các mục chức năng */}

                <div className="grid grid-cols-2 gap-4 p-4">
                    {[
                        { name: "Assignment", icon: documentTextOutline },
                        { name: "School Holiday", icon: calendarOutline },
                        { name: "Time Table", icon: timeOutline },
                        { name: "Result", icon: fileTrayFullOutline },
                        { name: "Date Sheet", icon: clipboardOutline },
                        { name: "School Gallery", icon: imagesOutline },
                        { name: "Leave Application", icon: documentLockOutline },
                        { name: "Events", icon: calendarNumberOutline },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center"
                        >
                            <IonIcon icon={item.icon} className="text-red-500 text-3xl" />
                            <p className="mt-2 text-gray-800 text-sm text-center">{item.name}</p>
                        </div>
                    ))}
                </div>
                {/* Bottom Tab Navigation */}
                {/* <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around py-3">
                    <Link to="/" className="flex flex-col items-center">
                        <IonIcon icon={homeOutline} className="text-blue-500 text-2xl" />
                        <span className="text-xs">Home</span>
                    </Link>
                    <Link to="/notifications" className="flex flex-col items-center">
                        <IonIcon icon={notificationsOutline} className="text-gray-500 text-2xl" />
                        <span className="text-xs text-gray-500">Notifications</span>
                    </Link>
                    <Link to="/profile" className="flex flex-col items-center">
                        <IonIcon icon={personOutline} className="text-gray-500 text-2xl" />
                        <span className="text-xs text-gray-500">Profile</span>
                    </Link>
                </div> */}
            </div>
        </div>
    );
}
