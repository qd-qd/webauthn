import { RpcProvider } from "starknet";

const provider = new RpcProvider({ nodeUrl: process.env.RPC_ENDPOINT as string });

export default provider;
