import { useState } from "react";
import dynamic from "next/dynamic";
import {
  getKeyCredentialCreationOptions,
  getRequestOptions,
} from "../utils/webauthn";
import { get, create } from "@github/webauthn-json/browser-ponyfill";
import ab2str from "arraybuffer-to-string";

// import the component client-side only
const WebAuthnSupportTable = dynamic(
  () => import("../components/WebAuthnSupportTable"),
  { ssr: false }
);

export default function Home() {
  const [displayName, setDeviceUsername] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const createAuthenticator = async () => {
    try {
      // fetch the challenge
      const [responseChallenge, resUserId] = await Promise.all([
        fetch("/api/webauthn/challenge"),
        fetch("/api/webauthn/challenge"),
      ]);
      const [challenge, userId] = await Promise.all([
        responseChallenge.arrayBuffer(),
        resUserId.arrayBuffer(),
      ]);

      // convert the userId to a base64 string that will be used as the deviceUsername
      const deviceUsername = ab2str(userId, "base64");

      // create the options for webauthn
      const options = getKeyCredentialCreationOptions(
        challenge,
        displayName,
        userId,
        deviceUsername
      );

      // create the credential
      const credential = await create(options);

      // @ts-ignore
      const pubKeyBrut = credential.response.getPublicKey();
      const pubKey = ab2str(
        pubKeyBrut.slice(pubKeyBrut.byteLength - 65),
        "hex"
      );

      return { pubKey, userId };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // TODO: would be the deploiement tx in the future
  const deploy = async () => {
    try {
      // disabled the deploiement button
      setIsDisabled(true);

      // create the authenticator that will be admin of the wallet
      const { pubKey, userId } = await createAuthenticator();

      console.log("pubkey", pubKey);
      console.log("userId", ab2str(userId, "base64"));

      // TODO: send the pubkey and the userId to the backend to deploy a contract
    } catch (e) {
      // enable again the deploiement button if an error occured
      setIsDisabled(false);

      console.error(e);
      throw e;
    }
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <WebAuthnSupportTable />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          rowGap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label htmlFor="deviceUsername">Authenticator name</label>
          <input
            name="deviceUsername"
            type="text"
            value={displayName}
            onChange={(e) => setDeviceUsername(e.target.value)}
            placeholder="Laptop - Macbook Pro"
          />
        </div>
        <div style={{ display: "flex", columnGap: "0.4rem" }}>
          <button disabled={isDisabled} onClick={deploy}>
            deploy
          </button>
        </div>
      </section>
    </main>
  );
}
