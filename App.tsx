import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { getGeminiResponse } from './services/geminiService';
import {
  MessageType,
  ChatHistoryItem,
  InternalDataProduct,
  FactualContext,
  StageGateDetails,
} from './types';

// Helper function to format timestamp
const getTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- START: C# Logic Translation Helpers ---

// Simulates the InternalDataProduct from the C# example
const MOCKED_INTERNAL_DATA_PRODUCT: InternalDataProduct = {
  NIK: "357801xxxxxxxxxx [REDACTED FOR PII]", // PII/SPD
  NamaLengkap: "Ibu Siti [REDACTED FOR PII]", // PII/SPD
  StatusLayanan: "Izin UMKM Anda Telah Diterima",
  TanggalPembaruan: "2025-11-07"
};

// Translates C# SanitizeContext logic
const sanitizeContext = (data: InternalDataProduct): string => {
  const factualContext: FactualContext = {
    StatusLayanan: data.StatusLayanan,
    TanggalPembaruan: data.TanggalPembaruan,
    RequestToken: crypto.randomUUID(), // Using crypto.randomUUID for a unique request token
  };
  const sanitizedJson = JSON.stringify(factualContext);
  console.log(`[STAGE GATE - KEAMANAN] Data PII/SPD telah disanitasi. Hanya JSON Konteks Faktual yang akan dikirim ke API Gemini.`);
  console.log(`[DATA KELUAR IDP]: ${sanitizedJson}`);
  return sanitizedJson;
};

// --- END: C# Logic Translation Helpers ---

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from the bot
  useEffect(() => {
    setChatHistory([
      {
        id: 'welcome-bot',
        text: 'Halo! Saya SuperMetaBot, Asisten Kognitif resmi Kota Metro. Bagaimana saya bisa membantu Anda hari ini?',
        type: MessageType.BOT,
        timestamp: getTimestamp(),
      },
    ]);
  }, []); // Run only once on component mount

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = useCallback(async (userQuery: string) => {
    setIsLoading(true);
    const newUserMessage: ChatHistoryItem = {
      id: `user-${Date.now()}`,
      text: userQuery,
      type: MessageType.USER,
      timestamp: getTimestamp(),
    };
    setChatHistory((prev) => [...prev, newUserMessage]);

    // Add an info message about RAG and Sanitization
    const ragInfoMessage: ChatHistoryItem = {
        id: `info-rag-${Date.now()}`,
        text: 'ℹ️ Simulasi RAG: Mengambil data internal & menerapkan Mandat Sanitization data.',
        type: MessageType.INFO,
        timestamp: getTimestamp(),
    };
    setChatHistory((prev) => [...prev, ragInfoMessage]);


    try {
      // 1. SIMULASI RAG & MANDAT SANITIZATION
      // Use a copy to avoid direct mutation
      const rawData = { ...MOCKED_INTERNAL_DATA_PRODUCT }; 
      const sanitizedContextJson = sanitizeContext(rawData);

      // 2. GENERATE FINAL PROMPT (dengan Konteks Sanitize)
      const finalPrompt = `Anda adalah Chatbot Layanan Publik Kota Metro. Berdasarkan konteks berikut: '${sanitizedContextJson}', dan pertanyaan user: '${userQuery}', berikan balasan yang formal, informatif, dan ringkas.`;
      console.log(`\n[LAPIS 7 - PANGGILAN LLM] Panggilan ke API Gemini dilakukan dengan prompt:\n${finalPrompt}`);

      // 3. PANGGILAN API GEMINI (via geminiService)
      const botResponseText = await getGeminiResponse(finalPrompt);

      const stageGateDetails: StageGateDetails = {
        rawInternalData: rawData,
        sanitizedContextJson: sanitizedContextJson,
        finalPromptToLLM: finalPrompt,
      };

      const newBotMessage: ChatHistoryItem = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        type: MessageType.BOT,
        timestamp: getTimestamp(),
        stageGateDetails: stageGateDetails,
      };
      setChatHistory((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error in chat process:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: `Error: Failed to get response. ${error instanceof Error ? error.message : String(error)}`,
          type: MessageType.INFO,
          timestamp: getTimestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to ensure handleSendMessage is stable

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
        <h1 className="text-xl font-bold">SuperMetaBot</h1>
        <span className="text-sm font-light">Stage Gate Compliant Inference</span>
      </header>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {chatHistory.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-gray-800">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Custom Scrollbar Styles for Tailwind JIT (optional, but good for aesthetics) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e0e0e0; /* light gray */
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* dark gray */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af; /* medium gray */
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280; /* darker gray */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; /* slightly darker on hover */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563; /* slightly darker on hover */
        }
      `}</style>
    </div>
  );
};

export default App;