
import './App.css';
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, sendEther } from './interaction';
import { ethers } from "ethers";


function App() {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState("");

  useEffect(() => {

    async function setup() {
      const { address, status } = await getCurrentWalletConnected();

      setWallet(address);

      setStatus(status);

      addWalletListener();

    }
    setup();
  }, []);

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const ethbalance = await provider.getBalance(walletAddress)
    const balanceInEth = ethers.utils.formatEther(ethbalance)


    setStatus(balanceInEth);
  };

  const onTransferBalancePressed = async () => {
    const { status } = await sendEther(walletAddress, transferAddress, transferAmount);
    setTransferStatus(status);
  };
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Populate the Data and Click on Button to execute...");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  return (
    <>
    <div className="container">

      <button className="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      
      <div>
        <ul>
          <li>
          <h2 style={{ paddingTop: "5px" }}>Transfer Balance</h2>
          </li>
          <li>
            
          </li>
          <li>        <input
            type="text"
            placeholder="Enter Wallet address 0x..."
            onChange={(e) => setTransferAddress(e.target.value)}
            value={transferAddress}
          />
          </li>
          <li>        <input
            type="text"
            placeholder="Enter Amount to be transferred"
            onChange={(e) => setTransferAmount(e.target.value)}
            value={transferAmount}
          />
          </li>
         
          <li>
            <button className="publish" onClick={onTransferBalancePressed}>
              Transfer Balance
            </button>
          </li>
          
          <li>
            <button className="balance" onClick={getBalance}>
              Balance
            </button>
          
          </li>

        
        </ul>
        </div>
       








      


    </div>
    <div className='show'>
       <div>
        <ul>
        <li>
            <p id="status">{transferStatus}</p>
          </li>
          <li>
          <p id="status">{status}</p>
          </li>
          </ul>
      </div>
    </div>
    </>
  );
}

export default App;
