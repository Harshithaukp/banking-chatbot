# banking-chatbot
# 🏦 Conversational AI Banking Chatbot

A fully functional WhatsApp-style conversational AI system for handling dynamic banking interactions including loan applications, card blocking, and account queries with multi-turn understanding and real-time task execution.

## 🚀 Features

### Core Banking Operations
- **Loan Applications** - Multi-step loan application process with amount and ID verification
- **Card Blocking** - Secure card blocking with card number and name verification
- **Account Queries** - Balance checks and mini statements
- **Loan Status** - Check existing loan application status

### AI Capabilities
- **Multi-turn Conversations** - Maintains context across multiple messages
- **Intent Recognition** - Understands user intent from natural language
- **Context Switching** - Seamlessly handles topic changes
- **Error Handling** - Graceful error handling with clarifying questions
- **Real-time Processing** - Simulated API calls with loading states

### User Experience
- **WhatsApp-like Interface** - Modern chat bubble design
- **Responsive Design** - Works on all device sizes
- **Real-time Timestamps** - Shows message timing
- **Typing Indicators** - Processing animations
- **Auto-scroll** - Automatically scrolls to latest messages

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **State Management**: React hooks (useState, useEffect)
- **Mock APIs**: Simulated banking operations with async/await

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Inter font
│   ├── page.tsx            # Main page rendering ChatBot
│   └── globals.css         # Tailwind CSS configuration
├── components/
│   ├── ChatBot.tsx         # Main chatbot with conversation logic
│   ├── ChatMessage.tsx     # Individual message bubbles
│   └── ChatInput.tsx       # Message input component
└── lib/
    └── bankAPIs.ts         # Mock banking API functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone/Download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:8000`

## 💬 How to Use

### Starting a Conversation
The chatbot greets you with available options:
- Loan applications
- Card blocking  
- Account balance & statements
- Loan status inquiries

### Example Conversations

#### 🏦 Loan Application
```
User: "I want to apply for a loan"
Bot: "💰 I'll help you apply for a loan! What loan amount are you looking for?"
User: "25000"
Bot: "Great! You're applying for $25,000. For verification, please provide your government-issued ID number:"
User: "ID123456789"
Bot: "🔄 Processing your loan application..."
Bot: "Great news! Your loan application for $25,000 has been pre-approved. Reference ID: LN..."
```

#### 🔒 Card Blocking
```
User: "I lost my card"
Bot: "🔒 I'll help you block your card immediately for security. Please provide your 16-digit card number:"
User: "1234567890123456"
Bot: "For security verification, please provide the name on the card:"
User: "John Doe"
Bot: "🔄 Processing your card block request..."
Bot: "✅ Your card ending with 3456 has been successfully blocked..."
```

#### 💰 Balance Check
```
User: "Check my balance"
Bot: "🏦 I can help you check your account details. Please provide your account number:"
User: "12345678"
Bot: "Do you need a balance check or a mini statement? Please type 'balance' or 'statement'."
User: "balance"
Bot: "💰 Account Balance for 12345678: $2,345.67..."
```

## 🔧 Key Components

### ChatBot.tsx
- **Conversation State Management**: Tracks current context (loan, blockCard, accountQuery, etc.)
- **Multi-turn Logic**: Handles step-by-step conversations
- **API Integration**: Calls mock banking APIs
- **Error Handling**: Graceful error recovery
- **Context Switching**: Allows users to change topics

### Mock Banking APIs (bankAPIs.ts)
- **applyLoan()**: Processes loan applications
- **blockCard()**: Handles card blocking requests
- **getAccountBalance()**: Retrieves account balance
- **getMiniStatement()**: Generates transaction history
- **getLoanStatus()**: Checks loan application status

### UI Components
- **ChatMessage**: Renders individual chat bubbles with timestamps
- **ChatInput**: Handles user input with auto-resize textarea
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🎨 Design Features

### WhatsApp-like Interface
- **Message Bubbles**: Rounded corners with proper alignment
- **User Messages**: Right-aligned with dark background
- **Bot Messages**: Left-aligned with light background
- **Timestamps**: Subtle time indicators
- **Auto-scroll**: Always shows latest messages

### Modern Styling
- **Clean Typography**: Inter font for readability
- **Consistent Colors**: Using CSS custom properties
- **Smooth Animations**: Loading indicators and transitions
- **Responsive Layout**: Works on mobile and desktop

## 🔒 Security Features

- **Input Validation**: Validates card numbers, IDs, and account numbers
- **Error Boundaries**: Prevents crashes from invalid input
- **Secure Mock Data**: Realistic but safe test data
- **Context Reset**: Clears sensitive data after transactions

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Hosting
```bash
npm run build
# Upload 'out' folder to your hosting provider
```

## 🔮 Future Enhancements

### AI Integration
- **OpenRouter API**: Replace rule-based logic with real AI
- **Natural Language Processing**: Better intent recognition
- **Sentiment Analysis**: Detect user emotions
- **Multi-language Support**: Support multiple languages

### Advanced Features
- **Voice Input**: Speech-to-text integration
- **File Uploads**: Document upload for loan applications
- **Video Chat**: Live agent handoff
- **Push Notifications**: Real-time updates

### Backend Integration
- **Real Banking APIs**: Connect to actual banking systems
- **Authentication**: User login and session management
- **Database**: Store conversation history
- **Analytics**: Track user interactions

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   fuser -k 8000/tcp
   npm run dev
   ```

2. **Dependencies Issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build Errors**:
   ```bash
   npm run build
   # Check for TypeScript errors
   ```

## 📝 License

This project is open source and available under the MIT License.



---
