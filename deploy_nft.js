const NrcSdk = require("@rather-labs/nrc-721-sdk");

// update these params
const ckbRPC = "https://testnet.ckbapp.dev/rpc";
const ckbIndexerRPC = "https://testnet.ckbapp.dev/indexer";

const data = {}; // update to data you want, or just left {}

async function deployNFT() {
  const { nftCell, ckb } = await NrcSdk.initialize({
    nodeUrl: ckbRPC,
    indexerUrl: ckbIndexerRPC,
  });

  const { rawTransaction, nftTypeScript, usedCapacity } = await nftCell.mint({
    nftContractTypeScript,
    factoryTypeScript,
    sourceAddress: ownerAddress,
    targetAddress: targetAddress,
    fee: 0.0001,
    data,
  });

  console.log(
    "rawTransaction:",
    util.inspect(rawTransaction, false, null, true)
  );
  console.log({
    nftTypeScript,
    usedCapacity,
  });

  const signedTx = ckb.signTransaction(ownerPrivateKey)(rawTransaction);
  const txHash = await ckb.rpc.sendTransaction(signedTx, "passthrough");

  console.log("Transaction hash:", txHash);

  process.exit(0);
}

deployNFT();
