import { RotateCw, Smartphone } from 'lucide-react';

export default function DeviceOrientationWarning() {
  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900 hidden flex-col items-center justify-center text-white portrait:flex portrait:md:hidden landscape:hidden">
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Smartphone size={80} className="text-slate-300" />
          <RotateCw size={36} className="absolute -bottom-2 -right-2 text-amber-500 animate-[spin_3s_linear_infinite]" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center px-4 text-amber-500">
        Vui lòng xoay ngang màn hình
      </h2>
      <p className="text-slate-300 text-center px-8 max-w-sm text-sm leading-relaxed">
        Thiết bị hiện đang ở chế độ dọc. Trò chơi được thiết kế tối ưu nhất để trải nghiệm ở màn hình ngang.
      </p>
    </div>
  );
}
