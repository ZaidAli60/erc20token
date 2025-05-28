import React, { useState } from 'react';

export default function TokenDashboard({
  name = "EmergingTechGrid",
  symbol = "ETG",
  contractAddress = "0x325fAC0AB96DBcD8d58F5f83BeB723fbD0EA4d48",
  walletAddress = "0xYourWalletAddressHere",
  totalSupply = "1,000,000 ETG",
  onTransfer,
  onCheckBalance,
}) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [checkAddress, setCheckAddress] = useState("");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container my-5" style={{ maxWidth: '720px' }}>
      <h1 className="mb-4 text-center fw-bold text-primary">EmergingTechGrid Token (ETG)</h1>

      {/* Token Info Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">{name} <span className="badge bg-secondary">{symbol}</span></h4>

          <p className="mb-2">
            <strong>Contract Address:</strong> <code className="text-break">{contractAddress}</code>{" "}
            <button
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={() => copyToClipboard(contractAddress)}
            >
              Copy
            </button>
          </p>

          <p className="mb-2">
            <strong>Wallet Address:</strong> <code className="text-break">{walletAddress}</code>{" "}
            <button
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={() => copyToClipboard(walletAddress)}
            >
              Copy
            </button>
          </p>

          <p className="mb-0">
            <strong>Total Supply:</strong> {totalSupply}
          </p>
        </div>
      </div>

      {/* Transfer Token Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold">Transfer Tokens</div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="recipient" className="form-label">Recipient Address</label>
            <input
              type="text"
              id="recipient"
              className="form-control"
              placeholder="Enter recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount ({symbol})</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={() => onTransfer && onTransfer(recipient, amount)}
            disabled={!recipient || !amount}
          >
            Transfer Tokens
          </button>
        </div>
      </div>

      {/* Check Token Balance */}
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white fw-semibold">Check Token Balance</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter wallet address"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
            />
            <button
              className="btn btn-secondary"
              onClick={() => onCheckBalance && onCheckBalance(checkAddress)}
              disabled={!checkAddress}
            >
              Check Balance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
