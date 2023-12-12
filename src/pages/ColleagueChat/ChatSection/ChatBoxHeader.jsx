import Search from "/components/Search";
import ChatOption from "./ChatOption";
import { useState, useEffect } from "react";
import { getUserById } from "../../../api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
export default function ChatBoxHeader(props) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const data = await getUserById(props.conversationId);
      setUser(data);
    }
    fetchData();
  }, [props.conversationId]);
  return (
    <div className="flex flex-row justify-between items-center bg-gray-50 h-12 shadow">
      <div className="flex flex-row justify-start items-center gap-1 px-5 ">
        <Avatar className='h-8 w-8'>
        <AvatarImage src={user?.picture} alt="@shadcn" />
        <AvatarFallback className="bg-gray-300 p-1"><User2 /></AvatarFallback>
      </Avatar>
        <div className="flex ml-1 items-center justify-between">
          <p className="font-bold text-md">{user?.lastName} {" "} {user?.firstName}</p>
        </div>
      </div>

      <div className="flex relative items-center flex-row w-1/2 h-12 justify-end select-none">
        <Search />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mx-5 cursor-pointer text-gray-600 hover:text-black"
          onClick={() => props.setIsChatOption(!props.isChatOption)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
        {props.isChatOption && <ChatOption />}
      </div>
    </div>
  );
}
