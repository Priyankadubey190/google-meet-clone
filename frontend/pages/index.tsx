import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Google Meet Clone</h1>
      <input
        className="mt-4 p-2 border rounded"
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => router.push(`/room/${roomId}`)}
      >
        Join Room
      </button>
    </div>
  );
}
