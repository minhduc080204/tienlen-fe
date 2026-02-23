import GameActions from "../components/GameActions";
import HomeHeader from "../components/HomeHeader";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg-home.png')",
      }}
    >      
      <div className="flex flex-col min-h-screen">
        <HomeHeader />
        <GameActions />
        <div>hiaisjk Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio eius impedit provident hic obcaecati blanditiis expedita atque? Debitis ipsam corrupti quisquam veniam magnam. Cum iusto facilis, odio quisquam harum exercitationem.</div>
      </div>
    </div>
  );
}
