import { useState } from "react";
import ChannelOption from "./ChannelOption";
import PinnedMessageList from "./PinnedMessageList";
import AllMember from "./AllMember";
import Media from "./Media";
import Files from "./Files";
import Links from "./Links";
export default function (props) {
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div className="flex flex-col w-2/5 2xl:w-1/3 flex-shrink-0 border shadow">
      {selectedOption === "" && <ChannelOption setSelectedOption={setSelectedOption} setIsClickedChannelUtility={props.setIsClickedChannelUtility} />}
      {selectedOption === "pinnedMessageList" && <PinnedMessageList setJump={props.setJump} setSelectedOption={setSelectedOption} conversationId={props.conversationId} isChannel={props.isChannel} setPinMessages={props.setPinMessages} pinMessages={props.pinMessages} setMessages={props.setMessages}/>}
      {selectedOption === "allMember" && <AllMember setSelectedOption={setSelectedOption} conversationId={props.conversationId}/>}
      {selectedOption === "media" && <Media setSelectedOption={setSelectedOption} conversationId={props.conversationId}/>}
      {selectedOption === "files" && <Files setSelectedOption={setSelectedOption} conversationId={props.conversationId}/>}
      {selectedOption === "links" && <Links setSelectedOption={setSelectedOption}/>}
    </div>
  );
}
