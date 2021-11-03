import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Election from '../contracts/Election.json';

// Custom hook to read  auth record and user profile doc
export function useElectionContract() {
  const [election, setElection] = useState(null);

  const [account, setAccount] = useState('');

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }

  useEffect(() => {
    // turn off realtime subscription
    const runAfterRun = async () => {
      await loadWeb3();
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const networkData = Election.networks[networkId];
      if (networkData) {
        setElection(new web3.eth.Contract(Election.abi, networkData.address));
      } else {
        window.alert('Election contract not deployed to detected network.');
      }
      window.ethereum.on('accountsChanged', async function (accounts) {
        // await loadAccount(dispatch, web3);
        setAccount(accounts[0]);
        window.location.reload();
      });
    };
    runAfterRun();

    return () => {
      console.log('cl3an up');
    };
  }, []);

  return { election, account };
}
