import { useState, useEffect } from "react";
import { X, Minus, Square } from "lucide-react";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  vendorName: string;
  onClose: () => void;
  initialMessage: string;
  position: { x: number, y: number };
  isFirstVendor?: boolean;
}

const ChatWindow = ({ vendorName, onClose, initialMessage, position, isFirstVendor }: ChatWindowProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Define conversation flows based on vendor
  const conversationFlow = isFirstVendor ? [
    { sender: "Procurement Agent", text: initialMessage },
    { sender: vendorName, text: "Hello! Yes, we do sell those parts. What quantity are you looking for?" },
    { sender: "Procurement Agent", text: "We're looking for a bulk order. What's your best price for 10,000 units?" },
    { sender: vendorName, text: "For an order that size, we can offer $2.95 per unit." }
  ] : [
    { sender: "Procurement Agent", text: initialMessage },
    { sender: vendorName, text: "Sorry, who is this? The line isn't clear..." },
    { sender: "Procurement Agent", text: "This is the procurement team from Manufacturing Solutions. I'm calling about deep groove ball bearings." },
    { sender: vendorName, text: "Ah, yes! Sorry about that. The connection is better now. For ball bearings, our minimum order is 5,000 units at $3.50 each." }
  ];

  useEffect(() => {
    // Add messages with different delays based on which window
    conversationFlow.forEach((message, index) => {
      const baseDelay = isFirstVendor ? 2000 : 3000; // 2s for first window, 3s for second
      const messageDelay = baseDelay + (index * 2000); // Add 2s between each message
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          ...message,
          timestamp: new Date(Date.now() + index * 1000).toLocaleTimeString()
        }]);
      }, messageDelay);
    });
  }, []);

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg w-80 border border-gray-200"
      style={{
        top: position.y,
        left: position.x,
        height: isMinimized ? "40px" : "400px"
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-t-lg">
        <span className="font-medium">{vendorName}</span>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)}>
            <Minus className="h-4 w-4" />
          </button>
          <button onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-40px)]">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.sender === "Procurement Agent" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg p-2 max-w-[80%] ${
                    message.sender === "Procurement Agent"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.sender} • {message.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow; 