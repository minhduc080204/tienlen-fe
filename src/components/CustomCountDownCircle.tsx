import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useState, useEffect } from "react";

type Props = {
    children?: React.ReactNode;
    duration: number;
    isPlayerCircle?: boolean;
};

export const CustomCountDownCircle = ({ children, duration, isPlayerCircle = false }: Props) => {
    const [timerSize, setTimerSize] = useState(80);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setTimerSize(isPlayerCircle ? 80 : 120);
            else if (window.innerWidth >= 840) setTimerSize(isPlayerCircle ? 60 : 90);
            else if (window.innerWidth >= 640) setTimerSize(isPlayerCircle ? 60 : 60);
        };

        handleResize(); // Chạy lần đầu
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Tính toán strokeWidth dựa trên size
    const strokeWidth = timerSize >= 120 ? 10 : timerSize >= 60 ? 7 : 5;

    return (
        <CountdownCircleTimer
            isPlaying
            duration={duration}
            size={timerSize}
            strokeWidth={strokeWidth}
            colors={["#00C9A7", "#d9ec05", "#f8ef47", "#ed720d", "#ff0808"]}
            colorsTime={[20, 15, 10, 5, 2]}
            trailColor="#1e293b"
        >
            {({ remainingTime }) => {
                // Thay thế style inline bằng Tailwind class cho phần text
                const textColor =
                    remainingTime <= 5 ? "text-[#FF4B5C]" :
                        remainingTime <= 12 ? "text-[#FFC75F]" : "text-[#00C9A7]";

                return (
                    <div className={`font-bold transition-all ${textColor} text-sm sm:text-xl lg:text-3xl`}>
                        {children || remainingTime}
                    </div>
                );
            }}
        </CountdownCircleTimer>
    );
};