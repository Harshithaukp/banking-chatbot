// Simulate network delay with a helper function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function applyLoan(data: any): Promise<string> {
  await delay(1500);
  if (!data.amount || !data.id) {
    throw new Error("Invalid loan data provided.");
  }
  
  // Simulate different responses based on amount
  const amount = parseInt(data.amount);
  if (amount > 100000) {
    return `Your loan application for $${data.amount} requires additional verification. Our team will contact you within 2-3 business days.`;
  } else {
    return `Great news! Your loan application for $${data.amount} has been pre-approved. Reference ID: LN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export async function blockCard(data: any): Promise<string> {
  await delay(1200);
  if (!data.cardNumber || !data.name) {
    throw new Error("Invalid card block data provided.");
  }
  
  const lastFour = data.cardNumber.slice(-4);
  return `✅ Your card ending with ${lastFour} has been successfully blocked for security. A replacement card will be sent to your registered address within 5-7 business days. Reference ID: CB${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export async function getAccountBalance(accountNumber: string): Promise<string> {
  await delay(800);
  if (!accountNumber) {
    throw new Error("Account number is required.");
  }
  
  // Simulate different balance amounts
  const balances = ["$2,345.67", "$15,892.34", "$567.89", "$8,234.12"];
  const randomBalance = balances[Math.floor(Math.random() * balances.length)];
  
  return `💰 Account Balance for ${accountNumber}: ${randomBalance}\n\nAvailable Balance: ${randomBalance}\nLast Updated: ${new Date().toLocaleString()}`;
}

export async function getMiniStatement(accountNumber: string): Promise<string> {
  await delay(1000);
  if (!accountNumber) {
    throw new Error("Account number is required.");
  }
  
  const transactions = [
    "- $50.00 | Grocery Store | Dec 15",
    "- $25.00 | Coffee Shop | Dec 14", 
    "- $100.00 | ATM Withdrawal | Dec 13",
    "- $75.50 | Gas Station | Dec 12",
    "+ $2,500.00 | Salary Credit | Dec 10"
  ];
  
  return `📄 Mini Statement for ${accountNumber}:\n\nRecent Transactions:\n${transactions.join('\n')}\n\nFor detailed statement, visit our website or nearest branch.`;
}

export async function getLoanStatus(loanId: string): Promise<string> {
  await delay(1000);
  if (!loanId) {
    throw new Error("Loan ID is required.");
  }
  
  const statuses = [
    "Under Review - Expected decision in 2-3 days",
    "Approved - Documents sent to your email",
    "Additional documents required - Check your email",
    "Disbursed - Amount credited to your account"
  ];
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  return `📋 Loan Status for ${loanId}: ${randomStatus}`;
}
