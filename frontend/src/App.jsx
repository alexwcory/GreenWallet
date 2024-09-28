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
  const [query, setQuery] = useState('');

  //web3 data
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountInfo, setAccountInfo] = useState({});
  
  useEffect(() => {
    setTimeout(()=>{
      setLoading(false);
    }, 500)
  }, [])

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
          "name": "setMRegAddress",
          "outputs": [],
          "stateMutability": "nonpayable",
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
          "type": "function",
          "constant": true
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
          "name": "getNumTransactions",
          "outputs": [
            {
              "internalType": "int256[]",
              "name": "_transactionList",
              "type": "int256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
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
          "type": "function",
          "constant": true
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
              "internalType": "string[]",
              "name": "ownedTiers",
              "type": "string[]"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
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
          "type": "function",
          "constant": true
        }
      ]
      const contractAddress = "0xAAC2EdE5C581f4D163607046f1de06d7bB09374e"
      const contract = new web3Instance.eth.Contract(contractABI, contractAddress);

      try {
        const result = await contract.methods.setMManAddress("0xAAC2EdE5C581f4D163607046f1de06d7bB09374e").call();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }

    initWeb3();
  }, [])

  const Search = (event) => {
    event.preventDefault();
    console.log("query: ", query)
    fetchAccountInfo(query)
    console.log("success:", accountInfo);

  }

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  }

  const fetchAccountInfo = async (query) => {
    if(!web3) return reject(new Error("Web3 not init"));

    try {
      const balance = await web3.eth.getBalance(query);
      const transactionCount = await web3.eth.getTransactionCount(query);

      const info = {
        query,
        balance: web3.utils.fromWei(balance, 'ether'),
        transactionCount,
      }

      setAccountInfo(info);
    } catch (error) {
      console.error("ERROR FETCHING ACCOUNT INFO:", error);
    }
  }

  return (
    <>
      <div id="loadingScreen" className={loading ? '' : 'hidden'}>
        <p>GreenWallet</p>
      </div>
      <div id="main">
        <Box id="nav">
          <Toolbar>
            <Typography variant="h6"  sx={{flexGrow: 1, alignItems: "flex-start"}}>
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
        <Box id="searchWrap" component="form" onSubmit={Search}>
          <TextField
            placeholder="Enter Wallet Address"
            onChange={handleSearchChange}
            id="walletAddressSearch"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
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
            />
          </Box>
      </div>
    </>
  )
}

export default App
