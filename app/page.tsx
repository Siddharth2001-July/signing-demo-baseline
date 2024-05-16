"use client";
import {Color} from "pspdfkit";
import { User } from "../utils/types";
import { useEffect, useState } from "react";
// import { I18nProvider, ThemeProvider, Drawer } from "@baseline-ui/core";
const I18nProvider = dynamic(() => import("@baseline-ui/core").then((mod) => mod.I18nProvider), { ssr: false });
const ThemeProvider = dynamic(() => import("@baseline-ui/core").then((mod) => mod.ThemeProvider), { ssr: false });
const Drawer = dynamic(() => import("@baseline-ui/core").then((mod) => mod.Drawer), { ssr: false })
import { ChatDialog } from "@baseline-ui/recipes";
//@ts-ignore
import { AIMessage, askAI } from "../utils/chatgpt.ts";
import { downArrowSVG, upArrowSVG } from "@/utils/helpers";
import dynamic from "next/dynamic";
const DynamicSignComp = dynamic(()=>import("./signingDemo"),{ssr:false});
import SignDemo from "./signingDemo";

const App: React.FC = () => {
  const allUsers: User[] = [
    {
      id: 1,
      name: "Admin",
      email: "admin@email.com",
      color: "PSPDFKit.Color.LIGHT_BLUE",
      role: "Editor",
    },
    {
      id: 2,
      name: "Signer 1",
      email: "signer1@email.com",
      color: "PSPDFKit.Color.LIGHT_YELLOW",
      role: "Signer",
    }
  ];
  const [currUser, setCurrUser] = useState(allUsers[0]);

  const aiName = "AI";
  const initMessages = [
    {
      type: "PLAIN",
      text: "Welcome to the PSPDFKit Sign App! Ask me anything about the code, like “How do I set the signees?",
      sender: aiName,
      canCopy: true,
      isComplete: true,
      id: "1",
    },
  ];
  const [messages, setMessages] = useState([...initMessages]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  useEffect(() => {
    var PSPDFKit:any
    (async function(){
      PSPDFKit = await import("pspdfkit");
      allUsers.forEach((user:any) => {
        user.color = PSPDFKit.Color.LIGHT_BLUE;
      })
    })()
    setTimeout(() => {
      //console.log("Setting current user to Signer");
      //setCurrUser(allUsers[1]);
    }, 5 * 1000);
  }, []);

  useEffect(() => {
    const ele = document.querySelector(`[aria-label= "Close"]`);
    if (ele) ele.innerHTML =  isChatOpen ? "<span style='color:blue;'>Close</span>" : "<span style='color:blue;'>Open</span>";
    if (ele) ele.innerHTML =  isChatOpen ? "<span style='color:blue;'>X</span>" : "<span style='color:blue;'>^</span>";
  })
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ThemeProvider theme={"system"}>
      <I18nProvider locale="en-US">
        <DynamicSignComp allUsers={allUsers} user={currUser} />
        <Drawer
          title="Ask AI (Beta)"
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            border: "0.5px solid grey",
            borderRadius: "10px",
            height: isChatOpen ? "70vh" : "7vh",
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
export default dynamic(()=>Promise.resolve(App),{ssr:false});
