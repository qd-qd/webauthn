import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  create,
  get,
  parseCreationOptionsFromJSON,
  parseRequestOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import {
  getKeyCredentialCreationOptions,
  getRequestOptions,
} from "../utils/webauthn";
import isWebAuthnSupported from "../utils/isWebAuthnSupported";

// import the component client-side only
const WebAuthnSupportTable = dynamic(
  () => import("../components/WebAuthnSupportTable"),
  { ssr: false }
);

enum STATUS {
  NOT_REGISTERED,
  LOGGED,
  NOT_LOGGED,
}

const HomeView = ({ status, userId }: { status: STATUS; userId: string }) => {
  if (status === STATUS.NOT_REGISTERED)
    return <p>Choose an username and register</p>;

  if (status === STATUS.NOT_LOGGED)
    return (
      <div>
        <p>You're registered! Here's the id assigned to you:</p>
        <p style={{ fontSize: "0.7rem" }}>{userId}</p>
        <p>You can now authentificate yourself if you want</p>
      </div>
    );

  return (
    <div>
      <p>You're logged! Here's the id assigned to you:</p>
      <p style={{ fontSize: "0.7rem" }}>{userId}</p>
    </div>
  );
};

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [currentUserId, saveUserId] = useState<string | null>();
  const [isSupported] = isWebAuthnSupported();
  const [status, setStatus] = useState<STATUS>(STATUS.NOT_REGISTERED);

  useEffect(() => {
    // fetch the userId from the local storage
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // if there is a userId saved it in the state
    saveUserId(userId);
    setStatus(STATUS.NOT_LOGGED);
  }, []);

  const register = async () => {
    try {
      // fetch the challenge and the userId
      const [challengeRes, userIdRes] = await Promise.all([
        fetch("/api/webauthn/challenge"),
        fetch("/api/userId", {
          method: "POST",
          body: JSON.stringify({ username }),
        }),
      ]);
      const [{ challenge }, { userId }] = await Promise.all([
        challengeRes.json(),
        userIdRes.json(),
      ]);

      // get the current domain
      const currentDomain = window.location.hostname;

      // create the options for webauthn
      const options = parseCreationOptionsFromJSON(
        getKeyCredentialCreationOptions(
          challenge,
          currentDomain,
          username,
          userId
        )
      );

      // create the credential
      const credential = await create(options);

      // save the ID in the state and in the local storage
      saveUserId(credential.id);
      localStorage.setItem("userId", credential.id);

      // set the status
      setStatus(STATUS.NOT_LOGGED);

      // log the certificate created by the authenticator during the registration process
      console.log(
        "Here's the certificate created by the authenticator you chose during the registration process",
        "\n",
        credential.toJSON()
      );
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
        getRequestOptions(challenge, currentUserId)
      );

      // create the credential
      const credential = await get(options);

      // flag the user as logged
      setStatus(STATUS.LOGGED);

      // log the certificate created by the authenticator during the authentification process
      console.log(
        "Here's the certificate created by the authenticator you chose during the authentification process",
        "\n",
        credential.toJSON()
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const logout = () => setStatus(STATUS.NOT_LOGGED);

  const reset = () => {
    saveUserId(null);
    setStatus(STATUS.NOT_REGISTERED);
    localStorage.removeItem("userId");
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
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="0xWebAuthn"
            disabled={!!currentUserId}
          />
        </div>
        <div>
          <button onClick={register} disabled={!isSupported || !!currentUserId}>
            register
          </button>
          <button onClick={reset} disabled={!isSupported || !currentUserId}>
            delete your account
          </button>
        </div>
        <div>
          <button
            onClick={login}
            disabled={!currentUserId || status === STATUS.LOGGED}
          >
            login
          </button>
          <button onClick={logout} disabled={status !== STATUS.LOGGED}>
            logout
          </button>
          <HomeView status={status} userId={currentUserId} />
        </div>
      </section>
    </main>
  );
}
