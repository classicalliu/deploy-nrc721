const NrcSdk = require("@rather-labs/nrc-721-sdk");
const util = require("util");

// update these params
const ckbRPC = "https://testnet.ckbapp.dev/rpc";
const ckbIndexerRPC = "https://testnet.ckbapp.dev/indexer";

const ownerAddress = "ckt...";
const ownerPrivateKey = "0x...";
const targetAddress = "ckt...";

const data = {}; // update to data you want, or just left {}

// get this from deploy_factory.js result typeScript
const factoryTypeScript = {
  codeHash:
    "0x00000000000000000000000000000000000000000000000000545950455f4944",
  hashType: "type",
  args: "0xa502aba2d7f3efe5055a3959644d885a8054bb708c61ec2ebf4fcddc93b69818",
};

async function deployNFT() {
  const { nftCell, ckb } = await NrcSdk.initialize({
    nodeUrl: ckbRPC,
    indexerUrl: ckbIndexerRPC,
  });

  const { rawTransaction, nftTypeScript, usedCapacity } = await nftCell.mint({
    nftContractTypeScript: {
      codeHash:
        "0x00000000000000000000000000000000000000000000000000545950455f4944",
      hashType: "type",
      args:
        "0xc2407f8b6ef27a10c35a55ab589e6bfc28db3f2fe5b08cab63384c88a02a14e6",
    },
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
