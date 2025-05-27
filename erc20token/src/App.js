import { useEffect, useState } from 'react';
import Web3 from 'web3';
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

  console.log(web3);


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

  const contractAddress = "0x325fAC0AB96DBcD8d58F5f83BeB723fbD0EA4d48"; // replace this

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
    console.log(addressToCheck);
    try {
      if (!web3 || !token || !addressToCheck) {
        alert('Missing web3, token, or address');
        return;
      }

      const decimals = await token.methods.decimals().call();
      const rawBalance = await token.methods.balanceOf(addressToCheck).call();

      // Convert balance from raw units to human-readable format
      const formattedBalance = Number(rawBalance) / 10 ** decimals;

      console.log(`Balance of ${addressToCheck}: ${formattedBalance} ${symbol}`);
      alert(`Balance: ${formattedBalance} ${symbol}`);
      return formattedBalance;
    } catch (error) {
      console.error('Failed to check balance:', error);
      alert('Error checking balance');
    }
  };


  return (
    <div className="container py-5">
      <div className="card shadow-lg rounded-4 p-4">
        <h2 className="text-primary text-center mb-4">CyberForge Token DApp</h2>
        <p><strong>Account:</strong> {account}</p>
        <p><strong>Balance:</strong> {balance}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Symbol:</strong> <strong>{symbol}</strong></p>

        <div className="form-group mb-3">
          <label>Recipient Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleTransfer}>
          Transfer Tokens
        </button>

        <button onClick={() => checkTokenBalance("0x08cee1BEFAD83d418Ec00f50da78c35507e68BD4")}>
          Check My Balance
        </button>
      </div>
    </div>
  );
}

export default App;
