import React from "react";
import { BackButton } from "../BackButton";
import { TokenIcon } from "../../assets/icons/TokenIcon";

interface RoomInfoProps {
  label: string;
  value?: string | number;
  bet?: number;
}

export function RoomInfo({ label, value, bet }: RoomInfoProps) {
  return (
    <div className="p-1.5 rounded-xl sm:rounded-2xl bg-amber-50/20 shadow-lg shadow-red-900/40">
      <div className="flex justify-between gap-3">
        <h1 className="font-bold text-[10px] lg:text-lg">{label}: </h1>
        <h1 className="font-bold text-[10px] lg:text-lg text-yellow-500">{value}</h1>
      </div>
      <div className="flex justify-between gap-1">
        <h1 className="font-bold text-[10px] lg:text-lg">Đặt cược:</h1>
        <h1 className="font-bold text-[10px] lg:text-lg text-yellow-500 flex items-center">
          {bet} <TokenIcon className="w-4 sm:w-5 lg:w-6" />
        </h1>
      </div>
    </div>
  );
}

interface MyDataProps {
  user: {
    avatarUrl?: string;
    name?: string;
  } | null;
  tokenBalance: number;
}

export function MyData({ user, tokenBalance }: MyDataProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={user?.avatarUrl || import.meta.env.VITE_BASE_AVATAR_URL}
        className="w-9 h-9 lg:w-12 lg:h-12 rounded-full border-2 border-red-500/80 shrink-0"
      />
      <div className="text-white bg-stone-700/20 rounded-3xl backdrop-blur-md px-3 pt-1.5">
        <p className="text-sm lg:text-lg font-semibold leading-tight">
          {user?.name ?? "unknown"}
        </p>
        <div className="text-xs lg:text-sm leading-tight">
          <div className="font-bold text-[10px] lg:text-lg text-yellow-500 flex items-center">
            Ví: {tokenBalance} <TokenIcon className="w-4 sm:w-5 lg:w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameLayoutProps {
  onBackClick: () => void;
  roomInfo: React.ReactNode;
  players?: React.ReactNode;
  table?: React.ReactNode;
  countdown?: React.ReactNode;
  bottom?: React.ReactNode;
  chat?: React.ReactNode;
  isDisconnected?: boolean;
}

export default function GameLayout({
  onBackClick,
  roomInfo,
  players,
  table,
  countdown,
  bottom,
  chat,
  isDisconnected,
}: GameLayoutProps) {
  return (
    <div
      className="w-full h-screen bg-cover bg-center relative overflow-hidden p-1"
      style={{ backgroundImage: "url(/bg-room.png)" }}
    >
      <div className="flex gap-2 sm:gap-3 lg:gap-5">
        <BackButton onClick={onBackClick} />
        {roomInfo}
      </div>

      {players}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {table}
        {countdown}
      </div>

      <div className="absolute bottom-2 sm:bottom-4 lg:bottom-6 w-full flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 px-4">
        {bottom}
      </div>

      {isDisconnected && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/80 px-3 py-1 rounded-xl">
          <h1 className="font-bold text-xs sm:text-base lg:text-lg text-yellow-500">
            Bạn bị mất kết nối! Hãy thoát Room
          </h1>
        </div>
      )}

      {chat}
    </div>
  );
}
