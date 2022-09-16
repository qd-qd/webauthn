import { useState, useEffect } from "react";
import { supported } from "@github/webauthn-json/browser-ponyfill";

type Details = {
  publicKeyCredentialSupport: boolean;
  navigatorSupport: boolean;
  navigatorCredentialsSupport: boolean;
  navigatorCredentialsCreateSupport: boolean;
  navigatorCredentialsGetSupport: boolean;
};

/*  check if webauthn is supported in the context the app is loaded
    if it's not the case, return the details */
const isWebAuthnSupported = (): [boolean, Partial<Details>] => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [details, setDetails] = useState<Partial<Details>>({});

  useEffect(() => {
    // check client-side if webAuthn is supported
    const support = supported();
    if (support) return setIsSupported(support);

    // if webauthn isn't supported, details the support
    const supportDetails: Details = {
      publicKeyCredentialSupport: !!window?.PublicKeyCredential,
      navigatorSupport: !!window?.navigator,
      navigatorCredentialsSupport: !!window?.navigator?.credentials,
      navigatorCredentialsCreateSupport:
        !!window?.navigator?.credentials.create,
      navigatorCredentialsGetSupport: !!window?.navigator?.credentials.get,
    };

    // store the details
    setDetails(supportDetails);
  }, []);

  return [isSupported, details];
};

export default isWebAuthnSupported;
