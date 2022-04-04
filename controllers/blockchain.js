import { ethers } from "ethers";

let provider = new ethers.providers.JsonRpcProvider();

let getSigner = async () => {
  // Look up the current block number
  //const signer = provider.getSigner();
  let balance = await provider.getBlockNumber();
  // 14467379

  console.log(balance);
};

getSigner();
