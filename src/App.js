
import './App.css';
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, sendEther } from './interaction';
import { ethers } from "ethers";
import Swal from 'sweetalert2'

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState("");
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
    const getBalance = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const ethbalance = await provider.getBalance(walletAddress)
      const balanceInEth = ethers.utils.formatEther(ethbalance)


      setBalance(balanceInEth);
    };
    getBalance();
  },);



  const onTransferBalancePressed = () => {


    if (transferAmount != 0 && transferAddress.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, transfer now!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { status } = await sendEther(walletAddress, transferAddress, transferAmount);
          if (String(status).substring(0, 6) == "https:") {
            setTransferStatus(<a id="status" href={status} target="_blank">{status}</a>);
          } else {
            setTransferStatus(<p id="status">{status}</p>);
          }
        }


      })
    } else {
      setTransferStatus(<p id="status">please enter valid address and amount</p>);
    }



  };
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Populate the Data and Click on Button to execute...");
        } else {
          setWallet("");
          setBalance("")
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
    <div className='main bg-primary text-white '>

      <h1 className='text-center mt-2 mb-2'>Metamask Integration</h1>

      <button className="walletButton btn btn-dark" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      {balance ? <h3 className="baln btn btn-dark">Balance : {balance}</h3> : ""}


      <div className='container mt-3'>



        <div className='row'>

          <div className='col-lg-6 m-auto py-3 px-3'>
            <h2 className=' text-left  '>Transfer Balance</h2>
            <label className='m-4'>Wallet Address </label>
            <input className=' form-control'
              type="text"
              placeholder="Enter Wallet address 0x..."
              onChange={(e) => setTransferAddress(e.target.value)}
              value={transferAddress}
            />
            <label className='m-4'>Amount </label>
            <input className=' form-control'
              type="text"
              placeholder="Enter Amount in wai to be transfer!"
              onChange={(e) => setTransferAmount(e.target.value)}
              value={transferAmount}
            />
            <button className="m-4 btn btn-dark" onClick={onTransferBalancePressed}>
              Transfer 
            </button>

          </div>


        
        </div>
        

      </div>
      <p className='receipt text-center  m-4'>
            {transferStatus}
          </p>
          <p className='m-4 text-center' >
            {status}
          </p>
    </div>
  );
}

export default App;
