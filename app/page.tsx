"use client";
import PSPDFKit from "pspdfkit";
import { User } from "../utils/types";
import { SignDemo } from "./signingDemo";
import { useEffect, useState } from "react";
import { I18nProvider, ThemeProvider } from "@baseline-ui/core";
import { ChatDialog } from "@baseline-ui/recipes";
import { link } from "fs";

const App: React.FC = () => {
  const allUsers: User[] = [
    {
      id: 1,
      name: "Admin",
      email: "admin@email.com",
      color: PSPDFKit.Color.LIGHT_BLUE,
      role: "Editor",
    },
    {
      id: 2,
      name: "Sid",
      email: "sid@email.com",
      color: PSPDFKit.Color.LIGHT_YELLOW,
      role: "Signer",
    },
    {
      id: 3,
      name: "Pav",
      email: "pav@email.com",
      color: PSPDFKit.Color.LIGHT_GREEN,
      role: "Signer",
    },
    {
      id: 4,
      name: "Jon",
      email: "jon@email.com",
      color: PSPDFKit.Color.LIGHT_GREY,
      role: "Signer",
    },
    {
      id: 5,
      name: "Nar",
      email: "nar@email.com",
      color: PSPDFKit.Color.fromHex("#0ffcf1"),
      role: "Signer",
    },
  ];
  const [currUser, setCurrUser] = useState(allUsers[0]);

  const initMessages = [
    {
      type: "PLAIN",
      text: "Ask me anything.",
      sender: "Assistant",
      canCopy: true,
      isComplete: true,
      id: "1"
    },
  ];
  const [messages, setMessages] = useState([...initMessages]);
  useEffect(() => {
    setTimeout(() => {
      //console.log("Setting current user to Signer");
      //setCurrUser(allUsers[1]);
    }, 5 * 1000);
  }, []);


  return (
    <ThemeProvider theme={"system"}>
      <I18nProvider locale="en-US">
        <SignDemo allUsers={allUsers} user={currUser} />
        <ChatDialog
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            border: "0.5px solid grey",
            borderRadius : "10px",
            height: "40vh",
            width: "300px",
          }}
          //@ts-ignore
          messages={messages}
          onInputChanged={function Da(inp) {
            console.log("Input Changed : ",inp);
          }}
          onMessageSubmit={function Da(inp) {
            console.log("Message Submitted : ",inp);
            const newMessage = {
              type: "PLAIN",
              text: inp,
              sender: currUser.name,
              isComplete: true,
              canCopy: true,
              id: Math.random().toString(),
            };
            
            setMessages([...messages, newMessage]);
          }}
          onStateChange={function Da(){}}
          variant="full-width"
        />
      </I18nProvider>
    </ThemeProvider>
  );
};
export default App;
