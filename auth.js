const msalConfig = {
  auth: {
   clientId: "6a5e759b-b39e-4a44-bc86-83c27e98a697", // from Entra App Registration
    authority: "https://login.microsoftonline.com/c0ad4574-ffd0-4a1e-8768-9623f647c978",
    redirectUri: window.location.origin,
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// Handle redirect callback
msalInstance.handleRedirectPromise().then(response => {
  const account = response?.account || msalInstance.getAllAccounts()[0];
  if (account) {
    msalInstance.setActiveAccount(account);
    document.getElementById("user").innerText = `Signed in as: ${account.username}`;
  } else {
    msalInstance.loginRedirect({ scopes: ["User.Read"] });
  }
}).catch(error => {
  console.error(error);
});
