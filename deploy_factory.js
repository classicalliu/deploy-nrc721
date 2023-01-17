const NrcSdk = require("@rather-labs/nrc-721-sdk");

// update these params
const ckbRPC = "https://testnet.ckbapp.dev/rpc";
const ckbIndexerRPC = "https://testnet.ckbapp.dev/indexer";

const ownerAddress = "ckt...";
const ownerPrivateKey = "0x...";
const targetAddress = "ckt...";

// token info
const factoryName = "";
const symbol = "";
const baseTokenUri = "";
const extraData = undefined; // should be a undefined /  buffer, such as Buffer.from("some data", "utf-8")

async function deployFactory() {
  const { factoryCell, ckb } = await NrcSdk.initialize({
    nodeUrl: ckbRPC,
    indexerUrl: ckbIndexerRPC,
  });

  const { rawTransaction, typeScript, usedCapacity } = await factoryCell.mint({
    name: factoryName,
    symbol,
    baseTokenUri,
    sourceAddress: ownerAddress,
    targetAddress: targetAddress,
    fee: 0.0001,
    extraData,
  });

  console.log({
    rawTransaction,
    typeScript,
    usedCapacity,
  });

  const signedTx = ckb.signTransaction(ownerPrivateKey)(rawTransaction);
  const txHash = await ckb.rpc.sendTransaction(signedTx, "passthrough");
  console.log("Transaction hash:", txHash);

  process.exit(0);
}

deployFactory();
