// src/components/FaceAuth.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { IonContent, IonPage } from '@ionic/react';

const FaceAuth: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hàm tải mô hình nhận diện khuôn mặt
  const loadModels = async () => {
    const MODEL_URL = '/models'; // Đường dẫn đến thư mục chứa các mô hình
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    setLoading(false);
  };

  // Hàm đăng ký khuôn mặt
  const registerFace = async () => {
    if (videoRef.current) {
      const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptor = detection.descriptor;
        localStorage.setItem("userFaceDescriptor", JSON.stringify(Array.from(descriptor))); // Lưu descriptor vào localStorage
        console.log("Khuôn mặt đã được đăng ký!");
        setIsRegistered(true);
      } else {
        console.log("Không phát hiện khuôn mặt, vui lòng thử lại.");
      }
    }
  };

  // Hàm đăng nhập bằng khuôn mặt
  const authenticateFace = async () => {
    if (videoRef.current) {
      const storedDescriptor = JSON.parse(localStorage.getItem("userFaceDescriptor") || "null");
      if (!storedDescriptor) {
        console.log("Không có khuôn mặt nào được đăng ký!");
        setIsRegistered(false);
        return;
      }

      // Kiểm tra xem storedDescriptor có đủ 128 phần tử không
      if (storedDescriptor.length === 128) {
        const faceMatcher = new faceapi.FaceMatcher(
          new faceapi.LabeledFaceDescriptors("user", [new Float32Array(storedDescriptor)]), 0.6
        );

        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch.label === "user") {
            console.log("Xác thực thành công!");
            setIsAuthorized(true);
          } else {
            console.log("Khuôn mặt không khớp.");
            setIsAuthorized(false);
          }
        } else {
          console.log("Không phát hiện khuôn mặt.");
        }
      } else {
        console.log("Khuôn mặt đã được đăng ký nhưng không có đủ 128 giá trị.");
      }
    }
  };

  // Tải mô hình khi component được mount
  useEffect(() => {
    loadModels().then(() => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    });
  }, []);

  return (
    <IonPage>
      <IonContent>
        <h2 className="text-black-500">Đăng ký và Đăng nhập bằng Khuôn mặt 1</h2>
        {loading ? (
          <p>Đang tải mô hình...</p>
        ) : (
          <div>
            <video ref={videoRef} autoPlay muted width="300" height="300" />
            <div>
              <button onClick={registerFace}>Đăng ký khuôn mặt</button>
              <button onClick={authenticateFace}>Đăng nhập bằng khuôn mặt</button>
            </div>
            <div>
              {isRegistered ? <p>Khuôn mặt đã được đăng ký.</p> : <p>Chưa đăng ký khuôn mặt.</p>}
              {isAuthorized ? <p>Đăng nhập thành công!</p> : <p>Chưa xác thực.</p>}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>

  );
};

export default FaceAuth;
