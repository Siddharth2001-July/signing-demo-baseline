"use client";
import PSPDFKit from "pspdfkit";
import { User } from "../utils/types";
import { SignDemo } from "./signingDemo";
import { useEffect, useState } from "react";
import { I18nProvider, ThemeProvider } from "@baseline-ui/core";

const App: React.FC = () => {
  const allUsers: User[] = [
    {
      id: 1,
      name: "Master",
      email: "master@email.com",
      color: PSPDFKit.Color.LIGHT_GREEN,
      role: "Editor",
    },
    {
      id: 2,
      name: "Signer 1",
      email: "signer1@email.com",
      color: PSPDFKit.Color.YELLOW,
      role: "Signer",
    },
  ];
  const [currUser, setCurrUser] = useState(allUsers[0]);
  useEffect(() => {
    setTimeout(() => {
      //console.log("Setting current user to Signer");
      //setCurrUser(allUsers[1]);
    }, 5 * 1000);
  }, []);

  return (
    <ThemeProvider theme={'system'}>
      <I18nProvider locale="en-US">
        <SignDemo allUsers={allUsers} user={currUser} />
      </I18nProvider>
    </ThemeProvider>
  );
};
export default App;
