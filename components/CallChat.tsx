import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image'; // Import Image from next/image

interface CallChatProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text?: string;
  file?: File;
  fileType?: string;
  senderName: string;
  senderProfile: string;
}

const CallChat = ({ onClose }: CallChatProps) => {
  const { user } = useUser(); // Get current user information from Clerk
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Function to safely get the profile image URL as a string
  const getProfileImageUrl = (): string => {
    if (typeof user?.setProfileImage === 'string') {
      return user.setProfileImage;
    }
    // Fallback URL or a default image placeholder
    return '/images/brand_logo.png';
  };

  const handleSendMessage = () => {
    if (messageText.trim() || selectedFile) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        file: selectedFile || undefined,
        fileType: selectedFile?.type || undefined,
        senderName: user?.fullName || 'Anonymous',
        senderProfile: getProfileImageUrl(), // Use the function to get the profile image URL
      };

      setMessages([...messages, newMessage]);
      setMessageText('');
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <div className="w-74 h-full bg-[#252a41] p-4 rounded-xl flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white font-bold">GPG Chat Room</span>
        <button
          onClick={onClose}
          className="text-white bg-[#252a41] rounded-full px-2 py-1 hover:bg-[#4c535b]"
        >
          x
        </button>
      </div>

      <div className="flex-grow overflow-y-auto chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start mb-4">
            <Image
              src={message.senderProfile}
              alt={message.senderName}
              className="w-8 h-8 rounded-full mr-2"
              width={32} // Specify width
              height={32} // Specify height
            />
            <div>
              <p className="text-white font-bold">{message.senderName}</p>
              {message.text && <p className="text-white">{message.text}</p>}
              {message.file && (
                <div>
                  {message.fileType?.startsWith('image/') ? (
                    <Image
                      src={URL.createObjectURL(message.file)}
                      alt="uploaded"
                      className="max-w-full h-auto rounded"
                      width={400} // Example width
                      height={300} // Example height
                    />
                  ) : (
                    <a
                      href={URL.createObjectURL(message.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {message.file.name}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <input
            type="text"
            className="w-full p-2 bg-[#19232d] text-white rounded mr-2"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="chat-file-input"
          />
          <label
            htmlFor="chat-file-input"
            className="cursor-pointer bg-[#252a41] text-white rounded px-2 py-1 hover:bg-[#4c535b] mr-2"
          >
            📎
          </label>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallChat;
