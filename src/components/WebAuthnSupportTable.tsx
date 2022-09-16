import useWebAuthnSupportCheck from "../utils/useWebAuthnSupportCheck";

const SupportEmoji = ({ isSupported }: { isSupported: boolean }) => (
  <span>{isSupported ? "✅" : "❌"}</span>
);

const WebAuthnSupportTable = () => {
  const [isSupported, details] = useWebAuthnSupportCheck();

  if (isSupported)
    return <p>WebAuthn is fully supported in this context! 🥳✅</p>;

  return (
    <div
      style={{ display: "flexbox", flexDirection: "column", rowGap: "0.5rem" }}
    >
      <p style={{ margin: 0 }}>
        window.PublicKeyCredential:{" "}
        <SupportEmoji isSupported={details.publicKeyCredentialSupport} />
      </p>
      <p style={{ margin: 0 }}>
        navigator: <SupportEmoji isSupported={details.navigatorSupport} />
      </p>
      <p style={{ margin: 0 }}>
        navigator.credentials:{" "}
        <SupportEmoji isSupported={details.navigatorCredentialsSupport} />
      </p>
      <p style={{ margin: 0 }}>
        navigator.credentials.create:
        <SupportEmoji isSupported={details.navigatorCredentialsCreateSupport} />
      </p>
      <p style={{ margin: 0 }}>
        navigator.credentials.get:{" "}
        <SupportEmoji isSupported={details.navigatorCredentialsGetSupport} />
      </p>
    </div>
  );
};

export default WebAuthnSupportTable;
