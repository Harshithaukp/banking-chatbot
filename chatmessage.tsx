interface ChatMessageProps {
  message: {
    id: number;
    sender: "user" | "bot";
    text: string;
    error?: boolean;
    timestamp?: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  
  const containerClasses = isUser
    ? "flex justify-end mb-4"
    : "flex justify-start mb-4";
    
  const bubbleClasses = isUser
    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 max-w-[80%] shadow-sm"
    : "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%] shadow-sm";
    
  const errorClasses = message.error ? " border-2 border-destructive bg-destructive/10" : "";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col">
        <div className={`${bubbleClasses} ${errorClasses}`}>
          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
        </div>
        {message.timestamp && (
          <p className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
