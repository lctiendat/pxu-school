import React, { useState, useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';
import { IonIcon, IonAlert, IonSpinner } from '@ionic/react';
import { eyeOffOutline, eyeOutline, scanOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slice/userSlice";
import { useHistory } from "react-router-dom";
import { RootState } from "../redux/store";
import { Camera } from '@capacitor/camera';


function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [studentId, setStudentId] = useState('IT220020');
    const [password, setPassword] = useState('Tiendat11082000@');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);
    const [isFaceAuthLoading, setIsFaceAuthLoading] = useState(false);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [isFaceIdRegistered, setIsFaceIdRegistered] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector((state: RootState) => state.user.loading);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);


    const requestCameraPermission = async () => {
        const status = await Camera.requestPermissions();
        if (status.camera !== 'granted') {
            alert("Ứng dụng cần quyền truy cập camera để sử dụng Face ID.");
        }
    };

    useEffect(() => {
        requestCameraPermission();
    }, []);

    // Kiểm tra xem người dùng đã đăng ký Face ID chưa
    useEffect(() => {
        const storedDescriptor = localStorage.getItem("userFaceDescriptor");
        setIsFaceIdRegistered(!!storedDescriptor);
    }, []);

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
                setErrorMessage(resultAction?.payload || 'Đăng nhập không thành công.');
                setShowAlert(true);
            }
        } catch (error) {
            setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
            setShowAlert(true);
        }
    };

    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };

    const handleFaceIdLogin = async () => {
        setIsFaceAuthLoading(true);
        setIsCameraVisible(true); // Hiển thị camera khi bắt đầu xác thực

        const storedDescriptor = localStorage.getItem("userFaceDescriptor");
        if (!storedDescriptor) {
            setErrorMessage("Chưa có khuôn mặt nào được đăng ký. Vui lòng đăng ký trước.");
            setShowAlert(true);
            setIsFaceAuthLoading(false);
            setIsCameraVisible(false);
            return;
        }

        await loadModels();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;

            setTimeout(async () => {
                const detection = await faceapi.detectSingleFace(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    const descriptor = new Float32Array(JSON.parse(storedDescriptor));
                    const faceMatcher = new faceapi.FaceMatcher(
                        [new faceapi.LabeledFaceDescriptors('user', [descriptor])], 0.4
                    );
                    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

                    if (bestMatch.label === 'user') {
                        setShowSuccessAlert(true); // Hiển thị thông báo xác thực thành công
                    } else {
                        setErrorMessage('Khuôn mặt không khớp. Vui lòng thử lại.');
                        setShowAlert(true);
                    }
                } else {
                    setErrorMessage('Không phát hiện khuôn mặt. Vui lòng thử lại.');
                    setShowAlert(true);
                }

                setIsFaceAuthLoading(false);
                (stream.getTracks()).forEach(track => track.stop());
                setIsCameraVisible(false); // Ẩn camera sau khi xác thực
            }, 2000);
        } catch (error) {
            setErrorMessage('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
            setShowAlert(true);
            setIsFaceAuthLoading(false);
            setIsCameraVisible(false);
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
                                className="absolute inset-y-10 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                onClick={togglePasswordVisibility}
                                aria-label="Toggle Password Visibility"
                            >
                                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} style={{ fontSize: "1.2rem" }} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 text-center text-sm font-semibold rounded-lg shadow-md flex justify-center items-center transition duration-300 ${loading ? "bg-gray-400" : "bg-gradient-to-b from-red-600 to-red-700 hover:bg-white hover:text-red-500 text-white"
                                }`}
                            disabled={loading}
                        >
                            {loading ? <IonSpinner name="crescent" color="white" /> : "Đăng nhập"}
                        </button>

                        {/* Hiển thị nút Face ID nếu người dùng đã đăng ký Face ID */}
                        {isFaceIdRegistered && (
                            <button
                                type="button"
                                onClick={handleFaceIdLogin}
                                className="flex justify-center items-center w-full py-3 text-center text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                            >
                                {isFaceAuthLoading ? <IonSpinner name="crescent" color="white" /> : (
                                    <>
                                        FaceID <IonIcon className="w-4 h-4 ml-3" icon={scanOutline} />
                                    </>
                                )}
                            </button>
                        )}

                        {/* Hiển thị video nếu camera được bật */}
                        {isCameraVisible && (
                            <div className="mt-4">
                                <video ref={videoRef} autoPlay muted width="100%" className="rounded-lg border" />
                            </div>
                        )}

                        <div className="text-right mt-4">
                            <a href="#" className="text-sm text-gray-500 hover:underline">Quên mật khẩu?</a>
                        </div>
                    </form>
                </div>

                {/* Thông báo lỗi*/} <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={"Thông báo"} message={errorMessage} buttons={["OK"]} />
                <IonAlert
                    isOpen={showSuccessAlert}
                    onDidDismiss={() => {
                        setShowSuccessAlert(false);
                        history.push('/dashboard'); // Chuyển đến dashboard sau khi xác thực thành công
                    }}
                    header={"Thành công"}
                    message={"Xác thực Face ID thành công!"}
                    buttons={["OK"]}
                />
            </div>
        </div>
    );
}

export default Login;
