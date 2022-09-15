import { useEffect, useState } from "react";
import {
  create,
  get,
  parseCreationOptionsFromJSON,
  parseRequestOptionsFromJSON,
  CredentialRequestOptionsJSON,
  CredentialCreationOptionsJSON,
  supported,
} from "@github/webauthn-json/browser-ponyfill";
import currentDomain from "../utils/currentDomain";

const getKeyCredentialCreationOptions = (
  challenge,
  currentDomain
): CredentialCreationOptionsJSON => ({
  publicKey: {
    // TODO: think about the challenge
    challenge,
    rp: {
      name: "Ledger",
      id: currentDomain,
    },
    // TODO: fix user
    user: {
      id: "UZSL85T9AFC",
      name: "lee@webauthn.guide",
      displayName: "Lee",
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    timeout: 60000,
    attestation: "indirect",
  },
});

const getRequestOptions = (challenge, id): CredentialRequestOptionsJSON => ({
  publicKey: {
    allowCredentials: [{ id, type: "public-key" }],
    timeout: 60000,
    challenge,
  },
});

export default function Home() {
  const [db, saveInDB] = useState<{ id?: string }>({});
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    setIsSupported(supported());
  }, []);

  const register = async () => {
    try {
      const res = await fetch("/api/webauthn/challenge");
      const { challenge } = await res.json();

      // create the options for webauthn
      const options = parseCreationOptionsFromJSON(
        getKeyCredentialCreationOptions(challenge, currentDomain)
      );

      // create the credential
      const credential = await create(options);

      // save the ID
      saveInDB({ id: credential.id });

      console.log(credential.toJSON());
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const login = async () => {
    try {
      const res = await fetch("/api/webauthn/challenge");
      const { challenge } = await res.json();

      // create the options for webauthn
      const options = parseRequestOptionsFromJSON(
        getRequestOptions(challenge, db.id)
      );

      // create the credential
      const credential = await get(options);

      // flag the user as logged
      setIsLogged(true);

      console.log(credential.toJSON());
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return (
    <div>
      <p>
        webauthn support:{" "}
        {isSupported === undefined ? "⌛" : isSupported ? "✅" : "❌"}
      </p>
      <button onClick={register} disabled={isSupported !== true}>
        register
      </button>
      <button onClick={login} disabled={!db.id}>
        login
      </button>
      {db?.id ? isLogged ? <p>logged!</p> : <p>Registered! {db.id}</p> : null}
    </div>
  );
}
