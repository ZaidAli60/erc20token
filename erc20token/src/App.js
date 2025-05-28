import { useEffect, useState } from 'react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [token, setToken] = useState(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [checkAddress, setCheckAddress] = useState("");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // console.log(web3);


  const contractAbi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const contractAddress = "0x96e3c5c12c3f27c55b606ece266a658662963b27"; // replace this

  // Load MetaMask and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const token = new web3.eth.Contract(contractAbi, contractAddress);
        setToken(token);

        const tokenName = await token.methods.name().call();
        const tokenSymbol = await token.methods.symbol().call();
        // const balance = await token.methods.balanceOf(accounts[0]).call();

        const rawBalance = await token.methods.balanceOf(accounts[0]).call();
        const formattedBalance = Web3.utils.fromWei(rawBalance, 'ether'); // works for 18 decimals
        setBalance(Number(formattedBalance).toFixed(2)); // shows up to 2 decimal places

        setName(tokenName);
        setSymbol(tokenSymbol);
        // setBalance(balance);
      } else {
        alert('Please install MetaMask to use this DApp!');
      }
    };

    init();
     // eslint-disable-next-line
  }, []);

  const handleTransfer = async () => {
    if (token && recipient && amount) {
      try {
        const gasPrice = await web3.eth.getGasPrice();

        // convert amount from human readable to smallest unit
        const amountToSend = (amount * (10 ** 18)).toString();

        await token.methods.transfer(recipient, amountToSend).send({
          from: account,
          gas: 100000,
          gasPrice,
        });

        alert(`Transferred ${amount} ${symbol} to ${recipient}`);
        setRecipient("")
        setAmount("")
      } catch (err) {
        console.error('Transfer failed:', err);
        alert('Transfer failed');
      }
    }
  };


  const checkTokenBalance = async (addressToCheck) => {
    try {
      if (!web3 || !token || !addressToCheck) {
        alert('Missing web3, token, or address');
        return;
      }

      const decimals = Number(await token.methods.decimals().call());
      const rawBalance = await token.methods.balanceOf(addressToCheck).call();

      const balanceBN = new BigNumber(rawBalance);
      const divisor = new BigNumber(10).pow(decimals);
      const formattedBalance = balanceBN.dividedBy(divisor).toFixed(4); // 4 decimals shown

      console.log(`Balance of ${addressToCheck}: ${formattedBalance} ${symbol}`);
      alert(`Balance: ${formattedBalance} ${symbol}`);
      return formattedBalance;
    } catch (error) {
      console.error('Failed to check balance:', error);
      alert('Error checking balance');
    }
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
            <strong>Wallet Address:</strong> <code className="text-break">{account}</code>{" "}
            <button
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={() => copyToClipboard(account)}
            >
              Copy
            </button>
          </p>

          <p className="mb-0">
            <strong>Total Supply:</strong> {balance}
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
            onClick={handleTransfer}
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
              onClick={() => checkTokenBalance(checkAddress)}
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

export default App;
