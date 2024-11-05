import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { IonContent, IonPage, IonButton, IonToggle, IonAlert, IonSpinner } from '@ionic/react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slice/userSlice";
import { RootState } from "../redux/store";
import { IonIcon } from '@ionic/react';
import { personOutline, logOutOutline, homeOutline, notificationsOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false); // Hiệu ứng loading khi đăng ký
    const [showRegisterSuccessAlert, setShowRegisterSuccessAlert] = useState(false); // Thông báo đăng ký thành công
    const videoRef = useRef<HTMLVideoElement>(null);

    // Hàm tải mô hình nhận diện khuôn mặt
    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setLoading(false);
    };

    // Hàm đăng ký khuôn mặt
    const registerFace = async () => {
        setIsRegistering(true); // Bắt đầu loading
        if (videoRef.current) {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                const descriptor = detection.descriptor;
                localStorage.setItem("userFaceDescriptor", JSON.stringify(Array.from(descriptor)));
                setShowRegisterSuccessAlert(true); // Hiển thị thông báo đăng ký thành công
            } else {
                alert("Không phát hiện khuôn mặt, vui lòng thử lại.");
            }
        }
        setIsRegistering(false); // Kết thúc loading
    };

    // Hàm đăng xuất
    const handleLogout = () => {
        dispatch(logoutUser());
        window.location.href = '/login';
    };

    // Bật/tắt camera khi toggle Face ID
    useEffect(() => {
        const initializeCamera = async () => {
            try {
                if (isFaceIdEnabled && videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    console.log("Video stream connected");
                } else {
                    // Tắt camera nếu Face ID bị vô hiệu hóa
                    if (videoRef.current && videoRef.current.srcObject) {
                        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                        console.log("Video stream disconnected");
                    }
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        };

        if (isFaceIdEnabled) {
            loadModels();
        }
        
        initializeCamera();

        // Dọn dẹp camera khi component bị unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [isFaceIdEnabled]);

    return (
        <IonPage>
            <IonContent className="flex flex-col h-screen bg-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-b from-red-600 to-red-700 p-6 rounded-b-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Thông tin cá nhân</h1>
                            <p className="text-white text-sm opacity-75">{user?.name}</p>
                        </div>
                        <IonIcon icon={personOutline} className="text-white text-3xl" />
                    </div>
                </div>

                {/* User Info */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-4 mx-4">
                    <h3 className="text-lg font-semibold mb-2">Thông tin cá nhân</h3>
                    <p className="text-sm text-gray-600">Mã sinh viên: {user?.code}</p>
                    <p className="text-sm text-gray-600">Email: {user?.mail}</p>
                    <p className="text-sm text-gray-600">Chuyên ngành: Công nghệ thông tin</p>
                </div>

                {/* Face ID Toggle */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-4 mx-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Xác thực bằng Face ID</h3>
                    <IonToggle
                        checked={isFaceIdEnabled}
                        onIonChange={() => {
                            setIsFaceIdEnabled(prev => !prev);
                        }}
                    />
                </div>

                {/* Register Face Form */}
                {isFaceIdEnabled && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-4 mx-4">
                        <h3 className="text-lg font-semibold mb-2">Đăng ký khuôn mặt</h3>
                        <video ref={videoRef} autoPlay muted width="100%" height="auto" className="rounded-lg mb-2" />
                        <IonButton expand="full" onClick={registerFace} disabled={isRegistering}>
                            {isRegistering ? <IonSpinner name="crescent" /> : "Đăng ký khuôn mặt"}
                        </IonButton>
                    </div>
                )}

                {/* Logout Button */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-4 mx-4">
                    <IonButton expand="full" color="danger" onClick={() => setShowLogoutAlert(true)}>
                        <IonIcon icon={logOutOutline} className="mr-2" />
                        Đăng xuất
                    </IonButton>
                </div>

                {/* Thông báo xác nhận đăng xuất */}
                <IonAlert
                    isOpen={showLogoutAlert}
                    onDidDismiss={() => setShowLogoutAlert(false)}
                    header={"Xác nhận"}
                    message={"Bạn có chắc chắn muốn đăng xuất?"}
                    buttons={[
                        {
                            text: 'Hủy',
                            role: 'cancel',
                        },
                        {
                            text: 'Đăng xuất',
                            handler: handleLogout,
                        },
                    ]}
                />

                {/* Thông báo đăng ký thành công */}
                <IonAlert
                    isOpen={showRegisterSuccessAlert}
                    onDidDismiss={() => {
                        setShowRegisterSuccessAlert(false);
                        window.location.href = '/login';
                    }}
                    header={"Thành công"}
                    message={"Đăng ký khuôn mặt thành công! Bạn có thể sử dụng Face ID để đăng nhập."}
                    buttons={["OK"]}
                />
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around py-3">
                    <Link to="/dashboard" className="flex flex-col items-center">
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
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
