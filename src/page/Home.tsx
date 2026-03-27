import { useEffect } from "react";
import HomeHeader from "../components/HomeHeader";
import MenuActions from "../components/MenuActions";
import { useSoundStore } from "../stores/sound.store";

export default function HomePage() {
  const playBGM = useSoundStore((s) => s.playBGM);

  useEffect(() => {
    playBGM();
  }, [playBGM]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg-home.png')",
      }}
    >
      <div className="flex flex-col min-h-screen">
        <HomeHeader />
        <MenuActions />
      </div>
    </div>
  );
}
