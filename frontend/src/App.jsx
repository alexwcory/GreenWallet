import { useState } from 'react'
import { useEffect } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Web3 from 'web3';
import './App.css'

function App() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [query, setQuery] = useState('');
  const [addressVal, setAddressVal] = useState('');

  //web3 data
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [contract, setContract] = useState(null);
  const [errors, setErrors] = useState({
    badQuery: false,
    notFound: false,
    badResponse: false,
  })

  useEffect(() => {
    // Wait for 0.5 seconds before starting fade-out
    setTimeout(() => {
      setLoading(false); // Start fade-out
      // Wait another 0.5 seconds (fade-out duration) before showing the main content
      setTimeout(() => {
        setShowContent(true);
      }, 1000); // Match CSS fade-out duration
    }, 500); // Initial wait before fade-out starts
  }, []);

  useEffect(() => {
    //MOCK WALLET ADDRESSES
    const initWeb3 = async () => {
      const web3Instance = new Web3('http://127.0.0.1:7545');
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccounts(accounts);

      const contractABI = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            }
          ],
          "name": "finishedAddContract",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "setMManRegInGreenWallet",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "setMRegInGreenWallet",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "setTOneGreenWallet",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "setMManAddress",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "setTOneAddress",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "setMRegAddress",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTOneURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "uri",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAddresses",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "_addresses",
              "type": "address[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            },
            {
              "internalType": "string[]",
              "name": "_chains",
              "type": "string[]"
            },
            {
              "internalType": "int256[]",
              "name": "numTransactions",
              "type": "int256[]"
            }
          ],
          "name": "addIntoContract",
          "outputs": [
            {
              "internalType": "int256",
              "name": "score",
              "type": "int256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_chain",
              "type": "string"
            }
          ],
          "name": "updateTransactions",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            }
          ],
          "name": "getScore",
          "outputs": [
            {
              "internalType": "int256",
              "name": "walletScore",
              "type": "int256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            }
          ],
          "name": "getNumTransactions",
          "outputs": [
            {
              "internalType": "int256[]",
              "name": "_transactionList",
              "type": "int256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            }
          ],
          "name": "addressExists",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_walletAddress",
              "type": "address"
            }
          ],
          "name": "walletOwns",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "chain",
              "type": "string"
            }
          ],
          "name": "addChain",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getChains",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "chainsList",
              "type": "string[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
      const contractAddress = import.meta.env.VITE_GREEN_WALLET_ADDRESS;
      const contract = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contract);
      // await contract.methods.addChain("bitcoin");
      // await contract.methods.addChain("ethereum");
      // const chains = await contract.methods.getChains().call();
      // console.log(chains[0]);

      // accounts.forEach((account) => {
      //   console.log(account);
      //   if (web3Instance.utils) {
      //     console.log("Web3 utils is available:", web3Instance.utils);
      //   } else {
      //     console.error("Web3 utils is null or undefined.");
      //     return;  // Exit early if utils is not available
      //   }
      //   const isValid = web3Instance.utils.isAddress(account);
      //   console.log("Is address valid and checksummed:", isValid);
      //   const executeTransaction = async () => {
      //     try {
      //       await contract.methods.addIntoContract(account, ["bitcoin", "ethereum"], [2, 4]).send({ from: account, gas: 3000000 });
      //       const hasAddr = await addrExistsCheck(account);
      //       console.log("Addr in there, ", hasAddr);
      //       await awaitAddress(account);
      //       console.log("Transaction successful");
      //     } catch (error) {
      //       console.error("Error executing transaction:", error);
      //     }
      //   };

      //   const awaitAddress = async (accountVal) => {
      //     try {
      //       const data = await contract.methods.walletOwns(accountVal).call();
      //       const ownedTiers = data.split(';').filter(s => s);
      //       console.log("Owned Tiers:", ownedTiers);
      //     } catch (error) {
      //       console.error("Error awaiting address:", error);
      //     }
      //   };
      //   const addrExistsCheck = async (accountVal) => {
      //     try {
      //       const addrExists = await contract.methods.addressExists(account).call();
      //       console.log(addrExists, "Exists");
      //     } catch (error) {
      //       console.error("Error waiting for added address", error);
      //     }
      //   };

      //   executeTransaction();
      // })
    }
    initWeb3();
  }, [])

  const Search = (event) => {
    event.preventDefault();
    console.log("info:", accountInfo);
    console.log("query: ", query)
    fetchAccountInfo(query)
    console.log("errors:", errors);
    console.log("success:", accountInfo);

  }

  const handleAddAddress = async () => {
    if (!addressVal) {
      alert('Please enter a wallet address.');
      return;
    }

    try {
      // Call the /addAddress API endpoint
      const response = await fetch('http://localhost:3000/addAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressVal }), // Send the wallet address as JSON
      });

      const result = await response.json(); // Parse the response

      if (response.ok) {
        alert(result.message); // Show success message
      } else {
        alert(result.error || 'Failed to add address'); // Show error message
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('An error occurred while adding the address.');
    }

  };


  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  }

  const handleAddAddressChange = (event) => {
    setAddressVal(event.target.value);
  }

  const fetchAccountInfo = async (query) => {
    if (!web3) return reject(new Error("Web3 not init"));

    try {
      const balance = await web3.eth.getBalance(query);
      const transactionCount = await web3.eth.getTransactionCount(query);
      const info = {
        query,
        balance: web3.utils.fromWei(balance, 'ether'),
        transactionCount,
      }
      setAccountInfo(info);
      setErrors(prev => ({ ...prev, badQuery: false }))
    } catch (error) {
      setErrors(prev => ({ ...prev, badQuery: true }))
      console.error("ERROR FETCHING ACCOUNT INFO:", error);
    }
  }

  return (
    <>
      <div id="loadingScreen" className={loading ? '' : 'hidden'}>
        <Box component="img" src="logo1000.png" onClick={() => { window.location.href = '/asdf' }} sx={{
          height: '300px',
          width: '300px',
        }}>
        </Box>
      </div>
      {showContent && (
        <div id="main">
          <Box id="nav">
            <Toolbar>
              <Box component="img" src="logoonly.svg" onClick={() => { window.location.href = '/asdf' }} sx={{
                height: 75,
                width: 75,
              }}>
              </Box>
              <Typography variant="h6" sx={{ alignItems: "flex-start" }}>
              </Typography>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Box>
                <Button color="inherit">Login</Button>
              </Box>

            </Toolbar>
          </Box>
          {(accountInfo !== null && !errors.badQuery) &&
            <div id="accountInfo">
              <div id="balDisplay">
                <h4>Remaining Balance</h4>
                <p>{accountInfo.balance}</p>
              </div>
              <div id="greenDisplay">
                <h4>Green Score</h4>
                <p>{accountInfo.balance}</p>
              </div>
              <div id="tranDisplay">
                <h4>Transactions Made</h4>
                <p>{accountInfo.transactionCount.toString()}</p>
              </div>
            </div>
          }
          <Box id="searchWrap" component="form" onSubmit={Search}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <TextField
            placeholder="Enter Wallet Address"
            onChange={handleSearchChange}
            id="walletAddressSearch"
            error={errors.badQuery}
            helperText={errors.badQuery ? "Could not match wallet address" : ""}            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment id="searchBtn" position="start" sx={{margin:0, height:"100%"}}>
                    <SearchIcon style={{color: "f1f1f1", cursor: "pointer"}} onClick={Search}/>
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#f1f1f1', // Default border color
                  borderRadius: 5,
                  borderWidth: 2,
                },
                '&:hover fieldset': {
                  borderColor: '#e3e3e3', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#e3e3e3', // Border color when focused
                },
              },
            }}
          /> */}
            <TextField
              placeholder="Add Wallet Address"
              onChange={handleAddAddressChange}
              id="AddAddress"
              error={errors.badQuery}
              helperText={errors.badQuery ? "Could not match wallet address" : ""} slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment id="searchBtn" position="start" sx={{ margin: 0, height: "100%" }}>
                      <SearchIcon style={{ color: "f1f1f1", cursor: "pointer" }} onClick={handleAddAddress} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#f1f1f1', // Default border color
                    borderRadius: 5,
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderColor: '#e3e3e3', // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e3e3e3', // Border color when focused
                  },
                },
              }}
            />
          </Box>
        </div>
      )}
    </>
  )
}

export default App
