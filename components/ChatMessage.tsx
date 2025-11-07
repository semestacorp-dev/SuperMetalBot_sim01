
import React from 'react';
import { MessageType, ChatHistoryItem } from '../types';
import { StageGateInfo } from './StageGateInfo';

interface ChatMessageProps {
  message: ChatHistoryItem;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === MessageType.USER;
  const isBot = message.type === MessageType.BOT;

  const bubbleClass = isUser
    ? 'bg-blue-500 text-white self-end rounded-br-none'
    : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start rounded-bl-none';

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[75%] px-4 py-2 rounded-lg shadow-md ${bubbleClass}`}>
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-75 mt-1 block">{message.timestamp}</span>
      </div>
      {isBot && message.stageGateDetails && (
        <div className="w-full mt-2 max-w-[75%]">
          <StageGateInfo details={message.stageGateDetails} />
        </div>
      )}
    </div>
  );
};

export { ChatMessage };
