import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const Room: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const ws = new WebSocket("ws://localhost:4000");
    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data.message]);
      }
    };
    setWs(ws);

    setupWebRTC();

    return () => {
      ws.close();
    };
  }, [id]);

  const setupWebRTC = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = new RTCPeerConnection();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const handleSendMessage = () => {
    if (ws && newMessage.trim()) {
      const message = { type: "chat", message: newMessage };
      ws.send(JSON.stringify(message));
      setMessages((prev) => [...prev, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3">
        <video ref={localVideoRef} autoPlay muted className="w-full h-full" />
        <video ref={remoteVideoRef} autoPlay className="w-full h-full my-4" />
      </div>
      <div className="w-1/3 p-4 bg-gray-200">
        <div className="mb-4">
          {messages.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
        <input
          className="p-2 border rounded w-full"
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="mt-2 p-2 bg-blue-500 text-white rounded w-full"
          onClick={handleSendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Room;
