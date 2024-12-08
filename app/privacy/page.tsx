export default function Privacy() {
  const privacy = {
    lastUpdated: "2024-12-08",
    policies: [
      {
        title: "1. Data Collection",
        content: "We only read public blockchain data associated with connected wallets."
      },
      {
        title: "2. Data Storage",
        content: "We do not store any personal data. All wallet interactions are temporary."
      },
      {
        title: "3. Third Parties",
        content: "We use Coinbase OnchainKit for wallet connections and Base network for blockchain interactions."
      },
      {
        title: "4. User Rights",
        content: "You can disconnect your wallet at any time to revoke access to your public data."
      }
    ]
  };

  return (
    <main className="container mx-auto px-4 py-16 text-white">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-400 mb-8">Last Updated: {privacy.lastUpdated}</p>
      
      <div className="space-y-8">
        {privacy.policies.map((policy) => (
          <section key={policy.title}>
            <h2 className="text-2xl font-bold mb-4">{policy.title}</h2>
            <p className="text-gray-300">{policy.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
} 