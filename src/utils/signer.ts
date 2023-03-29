import {
    SignerInterface,
    DeclareSignerDetails,
    Call,
    InvocationsSignerDetails,
    Signature,
    DeployAccountSignerDetails,
    typedData,
    Abi,
} from 'starknet';
import { parseRequestOptionsFromJSON, get } from "@github/webauthn-json/browser-ponyfill";

export class WebAuthnSigner implements SignerInterface {
    /**
   * Get the Starknet public key
   *
   * @returns {string} the public key
   */
    public async getPubKey(): Promise<string> {
        const toto = (await get(
            parseRequestOptionsFromJSON({
                publicKey: {
                    challenge: "dG90bw==", // "toto"
                    timeout: 60000,
                }
            })
        )).toJSON();

        console.log(toto);

        return toto.response.signature;
    }

    /**
   * Sign a Starknet invoke transaction
   *
   * @param {Invocation[]}  transactions - arrays of transactions to be signed
   * @param {InvocationsSignerDetails} transactionsDetail - addtional information about transactions
   * @returns {signature} the tx signature
   */
    public async signTransaction(
        transactions: Call[],
        transactionsDetail: InvocationsSignerDetails,
        abis?: Abi[]
    ): Promise<Signature> {
        throw new Error('not implemented')
    }

    /**
   * Sign a typed data with the private key set by derivation path
   *
   * @param {typedData.TypedData}  data - data to be signed
   * @param {string} accountAddress - account address
   * @returns {signature} the msg signature
   */
    public async signMessage(data: typedData.TypedData, accountAddress: string): Promise<Signature> {
        throw new Error('not implemented')
    }

    /**
   * Sign a bytestring (e.g perdersen hash) with the private key set by derivation path
   *
   * @param {string}  msg - bytestring to be signed
   * @param {boolean} show - if true, display the msg to be signed
   * @returns {signature} the msg signature
   */
    public async sign(msg: string, show: boolean): Promise<Signature> {
        throw new Error('not implemented')
    }

    public async signDeclareTransaction(transaction: DeclareSignerDetails): Promise<Signature> {
        throw new Error('not implemented')
    }

    public async signDeployAccountTransaction(transaction: DeployAccountSignerDetails): Promise<Signature> {
        throw new Error('not implemented')
    }
}
