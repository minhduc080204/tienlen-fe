import { GoogleLogin } from "@react-oauth/google";
import { useSoundStore } from "../stores/sound.store";

export default function GoogleLoginButton() {
  const playClick = useSoundStore((s) => s.playClick);

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={(res) => {
          playClick();
          console.log("Google token:", res.credential);
          // TODO: gửi token về BE Spring Boot
        }}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </div>
  );
}
