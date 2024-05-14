"use client";
import PSPDFKit from "pspdfkit";
import { User } from "../utils/types";
import { SignDemo } from "./signingDemo";
import { useEffect, useState } from "react";
import { I18nProvider, ThemeProvider, Drawer } from "@baseline-ui/core";
import { ChatDialog } from "@baseline-ui/recipes";
//@ts-ignore
import { AIMessage, askAI } from "../utils/chatgpt.ts";
import { downArrowSVG, upArrowSVG } from "@/utils/helpers";

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

  const aiName = "Ask AI";
  const initMessages = [
    {
      type: "PLAIN",
      text: "Hey there. Ask me anything about this signing demo.",
      sender: aiName,
      canCopy: true,
      isComplete: true,
      id: "1",
    },
  ];
  const [messages, setMessages] = useState([...initMessages]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  useEffect(() => {
    setTimeout(() => {
      //console.log("Setting current user to Signer");
      //setCurrUser(allUsers[1]);
    }, 5 * 1000);
  }, []);

  useEffect(() => {
    const ele = document.querySelector(`[aria-label= "Close"]`);
    if (ele) ele.innerHTML =  isChatOpen ? "<span style='color:blue;'>Close</span>" : "<span style='color:blue;'>Open</span>";
  })
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ThemeProvider theme={"system"}>
      <I18nProvider locale="en-US">
        <SignDemo allUsers={allUsers} user={currUser} />
        <Drawer
          title="Chat with AI"
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            border: "0.5px solid grey",
            borderRadius: "10px",
            height: isChatOpen ? "40vh" : "7vh",
            width: "300px",
            padding: "10px",
            boxShadow: "1px 1px 12px -8px black inset",
          }}
          onCloseRequest={() => {
            //alert("Closing Chat");
            setIsChatOpen(!isChatOpen);
          }}
        >
          {isChatOpen && (
            <ChatDialog
              style={{ height: "100%", width: "100%", overflow: "auto" }}
              //@ts-ignore
              messages={messages}
              onInputChanged={async function Da(inp) {
                //console.log("Input Changed : ",inp);
              }}
              onMessageSubmit={async function Da(inp) {
                console.log("Message Submitted : ", inp);

                const newMessage = {
                  type: "PLAIN",
                  text: inp,
                  sender: "You",
                  isComplete: true,
                  canCopy: true,
                  id: Math.random().toString(),
                };

                setMessages([...messages, newMessage]);
                const newAIMessage: AIMessage = {
                  role: "user",
                  content: inp,
                };
                await askAI([...aiMessages, newAIMessage]).then((res) => {
                  if (res) {
                    setAiMessages([
                      ...aiMessages,
                      { role: "user", content: inp },
                      res["choices"][0]["message"],
                    ]);
                    setMessages([
                      ...messages,
                      newMessage,
                      {
                        type: "PLAIN",
                        text: res["choices"][0]["message"]["content"],
                        sender: aiName,
                        isComplete: true,
                        canCopy: true,
                        id: Math.random().toString(),
                      },
                    ]);
                  }
                });
              }}
            />
          )}
        </Drawer>
      </I18nProvider>
    </ThemeProvider>
  );
};
export default App;
