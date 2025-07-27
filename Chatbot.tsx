"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { applyLoan, blockCard, getAccountBalance, getMiniStatement, getLoanStatus } from "../lib/bankAPIs";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  error?: boolean;
  timestamp: Date;
}

type ConversationContext = "initial" | "loan" | "blockCard" | "accountQuery" | "loanStatus" | "processing";

interface TempData {
  amount?: string;
  id?: string;
  cardNumber?: string;
  name?: string;
  accountNumber?: string;
  loanId?: string;
  step?: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      sender: "bot", 
      text: "👋 Welcome to SecureBank AI Assistant!\n\nI can help you with:\n• Loan applications\n• Card blocking\n• Account balance & statements\n• Loan status inquiries\n\nHow may I assist you today?",
      timestamp: new Date()
    }
  ]);
  
  const [context, setContext] = useState<ConversationContext>("initial");
  const [tempData, setTempData] = useState<TempData>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to last message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Omit<Message, 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
  };

  const addBotMessage = (text: string, error = false) => {
    addMessage({ id: Date.now(), sender: "bot", text, error });
  };

  const resetConversation = () => {
    setContext("initial");
    setTempData({});
    setIsProcessing(false);
  };

  const handleSend = async (userText: string) => {
    const userMsg: Message = { 
      id: Date.now(), 
      sender: "user", 
      text: userText,
      timestamp: new Date()
    };
    addMessage(userMsg);

    // Check for conversation reset commands
    if (/^(start over|reset|new|help|menu)$/i.test(userText.trim())) {
      resetConversation();
      addBotMessage("👋 How can I help you today?\n\n• Loan applications\n• Card blocking\n• Account balance & statements\n• Loan status inquiries");
      return;
    }

    try {
      setIsProcessing(true);

      if (context === "initial") {
        await handleInitialContext(userText);
      } else if (context === "loan") {
        await handleLoanContext(userText);
      } else if (context === "blockCard") {
        await handleBlockCardContext(userText);
      } else if (context === "accountQuery") {
        await handleAccountQueryContext(userText);
      } else if (context === "loanStatus") {
        await handleLoanStatusContext(userText);
      }
    } catch (error: any) {
      addBotMessage(`❌ An error occurred: ${error.message}\n\nType 'help' to start over.`, true);
      resetConversation();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitialContext = async (userText: string) => {
    const lowerText = userText.toLowerCase();
    
    if (/loan.*apply|apply.*loan|need.*loan|want.*loan/i.test(userText)) {
      setContext("loan");
      setTempData({ step: "amount" });
      addBotMessage("💰 I'll help you apply for a loan!\n\nWhat loan amount are you looking for? (Please enter the amount in dollars, e.g., 5000)");
    } else if (/block.*card|card.*block|lost.*card|stolen.*card|freeze.*card/i.test(userText)) {
      setContext("blockCard");
      setTempData({ step: "cardNumber" });
      addBotMessage("🔒 I'll help you block your card immediately for security.\n\nPlease provide your 16-digit card number:");
    } else if (/balance|statement|account.*query|mini.*statement|transaction/i.test(userText)) {
      setContext("accountQuery");
      setTempData({ step: "accountNumber" });
      addBotMessage("🏦 I can help you check your account details.\n\nPlease provide your account number:");
    } else if (/loan.*status|status.*loan|check.*loan|loan.*inquiry/i.test(userText)) {
      setContext("loanStatus");
      setTempData({ step: "loanId" });
      addBotMessage("📋 I'll check your loan status.\n\nPlease provide your loan reference ID:");
    } else {
      addBotMessage("I'd be happy to help! Please let me know what you need:\n\n• Type 'apply for loan' for loan applications\n• Type 'block card' to block your card\n• Type 'check balance' for account queries\n• Type 'loan status' to check loan status\n\nOr simply describe what you need help with.");
    }
  };

  const handleLoanContext = async (userText: string) => {
    if (tempData.step === "amount") {
      const amount = userText.replace(/[$,]/g, '').trim();
      if (!/^\d+$/.test(amount) || parseInt(amount) < 1000) {
        addBotMessage("Please enter a valid loan amount (minimum $1,000). For example: 5000");
        return;
      }
      setTempData({ ...tempData, amount, step: "id" });
      addBotMessage(`Great! You're applying for $${parseInt(amount).toLocaleString()}.\n\nFor verification, please provide your government-issued ID number:`);
    } else if (tempData.step === "id") {
      if (!/^\w{6,}$/.test(userText.trim())) {
        addBotMessage("Please provide a valid ID number (at least 6 characters):");
        return;
      }
      setTempData({ ...tempData, id: userText.trim(), step: "processing" });
      addBotMessage("🔄 Processing your loan application...\n\nThis may take a moment.");
      
      const response = await applyLoan({ amount: tempData.amount, id: userText.trim() });
      addBotMessage(response);
      addBotMessage("Is there anything else I can help you with today?\n\nType 'help' to see available options.");
      resetConversation();
    }
  };

  const handleBlockCardContext = async (userText: string) => {
    if (tempData.step === "cardNumber") {
      const cardNumber = userText.replace(/\s/g, '');
      if (!/^\d{12,16}$/.test(cardNumber)) {
        addBotMessage("Please enter a valid 12-16 digit card number (numbers only):");
        return;
      }
      setTempData({ ...tempData, cardNumber, step: "name" });
      addBotMessage("For security verification, please provide the name on the card (as it appears on your card):");
    } else if (tempData.step === "name") {
      if (!/^[A-Za-z\s]{2,}$/.test(userText.trim())) {
        addBotMessage("Please provide a valid name (letters and spaces only, at least 2 characters):");
        return;
      }
      setTempData({ ...tempData, name: userText.trim(), step: "processing" });
      addBotMessage("🔄 Processing your card block request...\n\nSecuring your account...");
      
      const response = await blockCard({ cardNumber: tempData.cardNumber, name: userText.trim() });
      addBotMessage(response);
      addBotMessage("Your card has been secured. Is there anything else I can help you with?\n\nType 'help' to see available options.");
      resetConversation();
    }
  };

  const handleAccountQueryContext = async (userText: string) => {
    if (tempData.step === "accountNumber") {
      if (!/^\d{8,}$/.test(userText.trim())) {
        addBotMessage("Please provide a valid account number (at least 8 digits):");
        return;
      }
      setTempData({ ...tempData, accountNumber: userText.trim(), step: "queryType" });
      addBotMessage("What would you like to check?\n\n• Type 'balance' for account balance\n• Type 'statement' for mini statement");
    } else if (tempData.step === "queryType") {
      const queryType = userText.toLowerCase().trim();
      if (queryType.includes('balance')) {
        addBotMessage("🔄 Fetching your account balance...");
        const response = await getAccountBalance(tempData.accountNumber!);
        addBotMessage(response);
      } else if (queryType.includes('statement')) {
        addBotMessage("🔄 Retrieving your mini statement...");
        const response = await getMiniStatement(tempData.accountNumber!);
        addBotMessage(response);
      } else {
        addBotMessage("Please type 'balance' or 'statement' to proceed:");
        return;
      }
      addBotMessage("Is there anything else I can help you with?\n\nType 'help' to see available options.");
      resetConversation();
    }
  };

  const handleLoanStatusContext = async (userText: string) => {
    if (tempData.step === "loanId") {
      if (!/^[A-Za-z0-9]{6,}$/.test(userText.trim())) {
        addBotMessage("Please provide a valid loan reference ID (at least 6 characters, letters and numbers):");
        return;
      }
      addBotMessage("🔄 Checking your loan status...");
      const response = await getLoanStatus(userText.trim());
      addBotMessage(response);
      addBotMessage("Is there anything else I can help you with?\n\nType 'help' to see available options.");
      resetConversation();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg shadow-lg border border-border overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary text-primary-foreground p-4 text-center">
        <h2 className="font-semibold">SecureBank Assistant</h2>
        <p className="text-xs opacity-90">Online • Secure Connection</p>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isProcessing && (
          <div className="flex justify-start mb-4">
            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%] shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} disabled={isProcessing} />
    </div>
  );
}
