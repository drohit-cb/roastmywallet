export default function Terms() {
  const terms = {
    lastUpdated: "2024-12-08",
    terms: [
      {
        title: "1. Purpose",
        content: "RoastMyWallet is an entertainment platform that analyzes on-chain wallet activity."
      },
      {
        title: "2. Wallet Connection",
        content: "By connecting your wallet, you authorize us to read your public on-chain data."
      },
      {
        title: "3. No Financial Advice",
        content: "Roasts are generated for entertainment purposes only and should not be considered financial advice."
      },
      {
        title: "4. Data Usage",
        content: "We only access publicly available on-chain data and do not store any personal information."
      }
    ]
  };

  return (
    <main className="container mx-auto px-4 py-16 text-white">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-gray-400 mb-8">Last Updated: {terms.lastUpdated}</p>
      
      <div className="space-y-8">
        {terms.terms.map((term) => (
          <section key={term.title}>
            <h2 className="text-2xl font-bold mb-4">{term.title}</h2>
            <p className="text-gray-300">{term.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
} 