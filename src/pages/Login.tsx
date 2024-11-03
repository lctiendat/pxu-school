import React, { useState } from "react";
import { IonIcon, IonAlert, IonSpinner } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slice/userSlice";
import { useHistory } from "react-router-dom";
import { RootState } from "../redux/store";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector((state: RootState) => state.user.loading);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId || !password) {
            setErrorMessage('Mã sinh viên và mật khẩu không được để trống.');
            setShowAlert(true);
            return;
        }

        try {
            const resultAction = await dispatch(loginUser({ studentId, password }));
            if (loginUser.fulfilled.match(resultAction)) {
                history.push('/dashboard');
            } else {
                setErrorMessage(resultAction.payload || 'Đăng nhập không thành công.');
                setShowAlert(true);
            }
        } catch (error) {
            setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
            setShowAlert(true);
        }
    };

    return (
        <div className="flex justify-center min-h-screen bg-gray-100">
            <div className="w-full">
                <div className="bg-gradient-to-b from-red-600 to-red-700 p-8 pt-16">
                    <div className="flex justify-center mb-8 relative">
                        <img src="/assets/images/logo-white.png" alt="Illustration" className="w-32 h-32 mx-auto" />
                    </div>
                    <h1 className="text-3xl font-bold text-center text-white mb-2">Hi, My name is @lctiendat</h1>
                </div>
                <div className="bg-white min-h-screen rounded-t-3xl shadow-lg p-8 -mt-8 space-y-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Mã sinh viên</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="text-sm mt-1 block w-full px-3 py-2 border-b border-b-red-500 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                                placeholder="IT123456789"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500">Mật khẩu</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-sm mt-1 block w-full px-3 py-2 border-b border-b-red-500 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mật khẩu của bạn"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                onClick={togglePasswordVisibility}
                                aria-label="Toggle Password Visibility"
                            >
                                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} style={{ fontSize: "1rem" }} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 text-center text-sm font-semibold rounded-lg shadow-md flex justify-center items-center transition duration-300 ${
                                loading ? "bg-gray-400" : "bg-gradient-to-b from-red-600 to-red-700 hover:bg-white hover:text-red-500 text-white"
                            }`}
                            disabled={loading}
                        >
                            {loading ? <IonSpinner name="crescent" color="white" /> : "Đăng nhập"}
                        </button>
                        <div className="text-right mt-4">
                            <a href="#" className="text-sm text-gray-500 hover:underline">Quên mật khẩu?</a>
                        </div>
                    </form>
                </div>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={"Thông báo"}
                    message={errorMessage}
                    buttons={["OK"]}
                />
            </div>
        </div>
    );
}

export default Login;
