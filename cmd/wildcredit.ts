import prisma from "../lib/prisma";

const Web3Lib = require("web3");

const WILD_DECIMALS = 10 ** 18;

// local json import
const Addresses = {
  feeRecipient: "0x487502F921BA3DADAcF63dBF7a57a978C241B72C",
  wild: "0x08a75dbc7167714ceac1a8e43a8d643a4edd625a",
  uniswapv3Oracle: "0x3D619bc03014917d3B27B3B86452346af36e58de",
};
const FeeRecipientABI = [
  {
    inputs: [
      {
        internalType: "contract IFeeConverter",
        name: "_feeConverter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FeeDistribution",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferInitiated",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ILendingPair", name: "_pair", type: "address" },
      { internalType: "bytes", name: "_path", type: "bytes" },
      { internalType: "uint256", name: "_minWildOutput", type: "uint256" },
    ],
    name: "convert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "feeConverter",
    outputs: [
      { internalType: "contract IFeeConverter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isOwner",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IFeeConverter",
        name: "_value",
        type: "address",
      },
    ],
    name: "setFeeConverter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const UniswapV3OracleABI = [
  {
    inputs: [
      {
        internalType: "contract IUniswapPriceConverter",
        name: "_uniPriceConverter",
        type: "address",
      },
      { internalType: "uint32", name: "_twapPeriod", type: "uint32" },
      { internalType: "uint16", name: "_minObservations", type: "uint16" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint16", name: "value", type: "uint16" },
    ],
    name: "NewMinObservations",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint32", name: "value", type: "uint32" },
    ],
    name: "NewTwapPeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IUniswapPriceConverter",
        name: "value",
        type: "address",
      },
    ],
    name: "NewUniPriceConverter",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferInitiated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "PoolAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "PoolRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH_POOL_FEE",
    outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_pairToken", type: "address" },
      { internalType: "uint24", name: "_poolFee", type: "uint24" },
    ],
    name: "addPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ethPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isOwner",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_pairToken", type: "address" },
      { internalType: "uint24", name: "_poolFee", type: "uint24" },
    ],
    name: "isPoolValid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minObservations",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "pools",
    outputs: [
      { internalType: "address", name: "pairToken", type: "address" },
      { internalType: "uint24", name: "poolFee", type: "uint24" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "removePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint16", name: "_value", type: "uint16" }],
    name: "setMinObservations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint32", name: "_value", type: "uint32" }],
    name: "setTwapPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IUniswapPriceConverter",
        name: "_value",
        type: "address",
      },
    ],
    name: "setUniPriceConverter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "tokenPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "tokenSupported",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "twapPeriod",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "uniFactory",
    outputs: [
      { internalType: "contract IUniswapV3Factory", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "uniPriceConverter",
    outputs: [
      {
        internalType: "contract IUniswapPriceConverter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wethOracle",
    outputs: [
      { internalType: "contract ILinkOracle", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// web3 config
const provider = process.env.INFURA_PROVIDER;

const web3 = new Web3Lib(provider);

const feeRecipientContract = new web3.eth.Contract(
  FeeRecipientABI,
  Addresses.feeRecipient
);

const UniswapV3OracleContract = new web3.eth.Contract(
  UniswapV3OracleABI,
  Addresses.uniswapv3Oracle
);

// UTILS
///check whether timestamp are on same day
const TimeStampAreOnSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();
/**
 * Fecth fee distribution from fee recipient event
 */
const FeeDistribution = async () => {
  const feeDistribution = await feeRecipientContract.getPastEvents(
    "FeeDistribution",
    { fromBlock: "earliest", toBlock: "latest" },
    (err: any) => {
      if (err) console.log("An error has occured", err);
    }
  );

  // today date
  const today = new Date();

  // iterate through events fee dist. array
  let totalFeeDistribution = 0;

  // search only tx in selected hour
  const eventNumber = feeDistribution.length;

  let index = eventNumber - 1;

  while (index >= 0) {
    const event = feeDistribution[index];

    const selectedBlock = await web3.eth.getBlock(event.blockNumber);

    const blockTimestamp = selectedBlock.timestamp * 1000;

    // check if tx is on same day that now
    if (TimeStampAreOnSameDay(today, new Date(blockTimestamp))) {
      totalFeeDistribution += event.returnValues.amount / WILD_DECIMALS;
    } else {
      // if timestamp isnt on sameday leave the loop by setting index > 0
      index = -1;
    }

    index -= 1;
  }

  // fetch wild price from Uniswap V3 Oracle Contract
  const wildPriceWithDec = await UniswapV3OracleContract.methods
    .tokenPrice(Addresses.wild)
    .call()
    .catch((err: any) => {
      console.log("An error has been occured:", err);
    });

  const wildPrice = wildPriceWithDec / WILD_DECIMALS;

  const totalFeeDistribution_dai = totalFeeDistribution * wildPrice;

  const response = {
    data: {
      fee: totalFeeDistribution_dai,
      wild_token: totalFeeDistribution,
      wild_price: wildPrice,
      datetime: today.setHours(0, 0, 0, 0),
    },
  };

  return response;
};

const coin = {
  name: "wildcredit",
  symbol: "WILD",
};

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

// Update wildcredit daily revenue data
// a cron job should hit this endpoint every  hour or so (can use github actions for cron)
const wildcreditImport = async () => {
  // Use the updatedAt field in the Day model and compare it with the
  // timestamp associated with the fee, if it's less than the timestamp
  // then update the day's revenue

  // Get last imported id: we will start importing from there
  const project = await getProject(coin.name);

  let response;
  await FeeDistribution()
    .then((res: any) => {
      response = res;
    })
    .catch((err: any) => {
      console.log("error has been occured with FeeDistribution function", err);
    });

  const fee = {
    date: response.data.datetime / 1000,
    fees: response.data.fee,
  };

  console.log(`fees calculation of ${fee.date}`);
  // store result into database
  await storeDBData(fee, project.id);

  console.log("exit scrape function.");

  return;
};

const getProject = async (name: string) => {
  let project = await prisma.project.findFirst({
    where: {
      name: name,
    },
  });

  if (project == null) {
    console.log("Project " + name + " doesn't exist. Create it");
    await prisma.project.create({
      data: {
        name: name,
        lastImportedId: "0",
      },
    });

    project = await prisma.project.findUnique({
      where: {
        name: name,
      },
    });
  }

  return project;
};

const storeDBData = async (
  dayData: { date: any; fees: any; blockHeight?: string },
  projectId: number
) => {
  const day = await prisma.day.findFirst({
    where: {
      date: dayData.date,
      projectId: projectId,
    },
  });

  if (day != null) {
    await prisma.day.update({
      where: {
        id: day.id,
      },
      data: {
        revenue: dayData.fees,
      },
    });
  } else {
    await prisma.day.create({
      data: {
        date: dayData.date,
        revenue: dayData.fees,
        projectId: projectId,
      },
    });
  }

  // update lastBlockID
  await prisma.project.updateMany({
    where: {
      name: coin.name,
    },
    data: {
      lastImportedId: dayData.date.toString(),
    },
  });

  return;
};

wildcreditImport()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
