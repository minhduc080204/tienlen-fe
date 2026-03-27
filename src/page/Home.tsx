import HomeHeader from "../components/HomeHeader";
import MenuActions from "../components/MenuActions";

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
        <MenuActions />
      </div>
    </div>
  );
}
