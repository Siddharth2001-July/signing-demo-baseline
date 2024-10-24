import { randomColor } from "@/utils/helpers";
import { User } from "@/utils/types";

const addSignee = (setUsers: any, PSPDFKit: any, users: User[]) => {
  if (typeof window !== "undefined") {
    const name = window.prompt("Enter signee's name:");
    const email = window.prompt("Enter signee's email:");

    let id = Math.floor(Math.random() * 1000000);
    while (id && users.find((user) => user.id === id)) {
      id = Math.floor(Math.random() * 1000000);
    }

    if (name && email) {
      setUsers((prevState: any) => [
        ...prevState,
        {
          // You can use your own logic to generate the id
          id: id,
          name: name,
          email: email,
          color: randomColor(PSPDFKit, users),
          role: "signee",
        } as User,
      ]);
    } else {
      alert("Please enter both name and email.");
    }
  }
};

export default addSignee;