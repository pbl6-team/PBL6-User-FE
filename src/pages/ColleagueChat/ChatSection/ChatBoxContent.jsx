import Message from "../../../components/Message";
import ChatBox from "/components/ChatBox";
import ReplySection from "../../../components/ReplySection";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMessagesColleague } from "../../../api";
import useIsNewMessage from "../../../storages/useIsNewMessage";
import { getUserById } from "../../../api";
import useColleagueStore from "@/storages/useColleagueStore";
import useHubStore from "@/storages/useHubStore";
import { InfiniteScroll } from "@/components/InfinityScroll";
import audio from "@/assets/bip.mp3";
import {
  SendMessage,
  UpdateMessage,
  DeleteMessage,
  SendEmoji,
  PinMessage,
  DeleteFileColleague,
} from "@/utils/hubs";


export default function ChatBoxContent() {
  const { conversationId } = useParams();
  const { hub, setHub } = useHubStore();
  const [messages, setMessages] = useState([]);
  const [messagesChild, setMessagesChild] = useState([]); // Lưu lại tin nhắn con của tin nhắn đang được reply
  const { isNewMessage, setIsNewMessage } = useIsNewMessage(); // Cập nhập danh sách hiển thị tin nhắn ở sideBar
  const [user, setUser] = useState(null);
  const audioRef = useRef();
  const {
    isClickedReply,
    setIsClickedReply,
    setIsNewChat,
    message,
    setMessage,
  } = useColleagueStore();
  const [forceScroll, setForceScroll] = useState({});
  const scrollDivRef = useRef();

  const fetchMoreData = async () => {
    if (messages.length === 0) {
      return;
    }
    const timeFirst = messages[0].sendAt;
    const now = new Date(timeFirst);
    const timeCursor = encodeURIComponent(now.toISOString());
    const data = await getMessagesColleague(conversationId, timeCursor, 10);
    // Sắp xếp tin nhắn theo thời gian
    const sortedData = data.sort(
      (a, b) => new Date(a.sendAt) - new Date(b.sendAt)
    );

    setMessages((prev) => [...sortedData, ...prev]);
    return data.length;
  };

  // Hub nhận tin nhắn mới
  useEffect(() => {
    if (hub) {
      hub.off("receive_message");
      hub.on("receive_message", (message) => {
        console.log("message đã nhận: ", message);
        setIsNewMessage(true);
        console.log("conversationId", conversationId);
        console.log("message.senderId", message.senderId);
        if ((message.senderId !== conversationId) || (message.receiverId !== localStorage.getItem("userId"))) {
          audioRef.current.play();
          return;
        }

        setMessages((currentMessages) => {
          const messages = [...currentMessages];
          const newMessage = { ...message };
          const parentMessageIndex = messages.findIndex(
            (m) => m.id === newMessage.parentId
          );
          if (
            newMessage.senderId === conversationId &&
            parentMessageIndex !== -1
          ) {
            const parentMessage = { ...messages[parentMessageIndex] };

            if (message.parentId === localStorage.getItem("idMessage")) {
              setMessagesChild((messagesChild) => [
                ...messagesChild,
                newMessage,
              ]);
            }
            parentMessage.childCount += 1;

            // Lưu lại tin nhắn để hiển thị trong reply box
            if (parentMessage.id === localStorage.getItem("idMessage")) {
              setMessage(parentMessage);
            }
            // Replace the old parent message with the updated one
            messages[parentMessageIndex] = parentMessage;
          } else {
            // If the message doesn't have a parent in the current set of messages, add it to the set
            messages.push(newMessage);
          }
          return messages;
        });
      });
      return () => {
        hub.off("receive_message");
      };
    } else {
      console.error("Hub is not connected");
    }
  }, [hub]);

  //Lấy thông tin user
  async function fetchData() {
    const data = await getUserById(localStorage.getItem("userId"));
    setUser(data);
    console.log("user", data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  //Lấy tin nhắn khi vào conversation
  useEffect(() => {
    async function fetchData() {
      // const now = new Date();
      // const timeCursor = encodeURIComponent(now.toISOString());
      const data = await getMessagesColleague(conversationId, null, 15);
      // Sắp xếp tin nhắn theo thời gian
      if (data.length > 0) {
        setMessages(data.reverse());
      }
    }
    fetchData();
  }, [conversationId]);

  // Hub nhận tin nhắn update
  useEffect(() => {
    if (hub) {
      hub.off("update_message");
      hub.on("update_message", (message_updated) => {
        console.log("đã chạy nhận update message: ", message_updated);
        if (message_updated.parentId === null) {
          setMessages((messages) =>
            messages.map((message) =>
              message.id === message_updated.id ? message_updated : message
            )
          );
        } else {
          setMessagesChild((messagesChild) =>
            messagesChild.map((messageChild) => {
              if (messageChild.id === message_updated.id) {
                return message_updated;
              } else {
                return messageChild;
              }
            })
          );
        }
        // Lưu lại tin nhắn để hiển thị trong reply box
        if (message_updated.id === localStorage.getItem("idMessage")) {
          setMessage(message_updated);
        }
        setIsNewMessage(true);
        return () => {
          hub.off("update_message");
        };
      });
    } else {
      console.error("Hub is not connected");
    }
  }, [hub]);

  // Hub nhận tin nhắn delete
  useEffect(() => {
    if (hub) {
      hub.off("delete_message");
      hub.on("delete_message", (message_deleted) => {
        console.log("đã chạy delete message");
        if (message_deleted.parentId === null) {
          setMessages((messages) =>
            messages.filter((message) => message.id !== message_deleted.id)
          );
        } else {
          console.log("đã chạy delete message child", message_deleted);
          setMessages((currentMessages) => {
            const messages = [...currentMessages]; // Create a new copy of messages
            const parentMessageIndex = messages.findIndex(
              (m) => m.id === message_deleted.parentId
            );
            if (parentMessageIndex !== -1) {
              // If the message has a parent in the current set of messages
              const parentMessage = { ...messages[parentMessageIndex] }; // Create a new copy of the parent message
              parentMessage.childCount -= 1;
              // Lưu lại tin nhắn để hiển thị trong reply box
              setMessage(parentMessage);
              setMessagesChild((messagesChild) =>
                messagesChild.filter(
                  (messageChild) => messageChild.id !== message_deleted.id
                )
              );
              // Replace the old parent message with the updated one
              messages[parentMessageIndex] = parentMessage;
              return messages;
            }
            return messages;
          });
        }
        if (message_deleted.id === localStorage.getItem("idMessage")) {
          setMessage(null);
          setIsClickedReply(false);
        }
        //setIsNewMessage(true);
        return () => {
          hub.off("delete_message");
        };
      });
    } else {
      console.error("Hub is not connected");
    }
  }, [hub]);

  //Hub nhận emoji
  useEffect(() => {
    if (hub) {
      hub.off("receive_emoji");
      hub.on("receive_emoji", (emoji) => {
        console.log("emoji", emoji);
        setMessages((messages) =>
          messages.map((message) =>
            message.id === emoji.messageId
              ? { ...message, emojiCount: emoji.emojiCount }
              : message
          )
        );
      });
      return () => {
        hub.off("receive_emoji");
      };
    } else {
      console.error("Hub is not connected");
    }
  }, [hub]);

  // Hub nhận lỗi
  useEffect(() => {
    if (hub) {
      hub.off("error");
      hub.on("error", (error) => {
        console.log("error", error);
      });
      return () => {
        hub.off("error");
      };
    }
  }, [hub]);

  // scroll to bottom
  const scrollToBottom = () => {
    setForceScroll({});
  };

  useEffect(() => {
    if (scrollDivRef.current) {
      scrollDivRef.current.scroll({
        top: scrollDivRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [forceScroll]);

  // if (messages.length === 0) {
  //   console.log("messages null");
  //   return (
  //     <div className="flex flex-col justify-center items-center h-full">
  //       <Avatar>
  //         <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  //         <AvatarFallback>CN</AvatarFallback>
  //       </Avatar>
  //       <span>{user?.firstName }</span>
  //       <p className="text-gray-500 text-lg font-semibold">
  //         Bắt đầu cuộc trò chuyện
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-row">
      <div
        style={{ height: "calc(100vh - 3.5rem)" }}
        className="flex flex-col w-full"
      >
        <InfiniteScroll
          getMore={fetchMoreData}
          invokeHeight={5}
          scrollDivRef={scrollDivRef}
          className="flex flex-col justify-start overflow-y-scroll h-full min-w-[400px] py-4 gap-1"
        >
          {messages.map((message) => (
            <Message
              id={`message-${message.id}`}
              key={message.id}
              message={message}
              setMessage={setMessage}
              setIsClickedReply={setIsClickedReply}
              DeleteMessage={(idMessage) =>
                DeleteMessage(hub, idMessage, setMessages, setIsClickedReply)
              }
              UpdateMessage={(idMessage, message) =>
                UpdateMessage(hub, idMessage, message, false)
              }
              SendEmoji={(emoji) => SendEmoji(hub, message.id, emoji)}
              PinMessage={(messageId) =>
                PinMessage(hub, messageId, !message.isPined)
              }
              DeleteFile={(fileId) =>
                DeleteFileColleague(
                  hub,
                  fileId,
                  message.id,
                  setMessages,
                  setIsClickedReply,
                  false
                )
              }
            />
          ))}
        </InfiniteScroll>

        <ChatBox
          SendMessage={(message, files) =>
            SendMessage(
              hub,
              conversationId,
              message,
              setMessages,
              setIsNewMessage,
              user,
              scrollToBottom,
              false,
              files
            )
          }
        />
      </div>
      {isClickedReply && (
        <ReplySection
          message={message}
          setMessage={setMessage}
          setIsClickedReply={setIsClickedReply}
          messages={messages}
          setMessages={setMessages}
          messagesChild={messagesChild}
          setMessagesChild={setMessagesChild}
          conversationId={conversationId}
          isChannel={false}
        />
      )}
      <audio ref={audioRef} preload="metadata">
        <source type="audio/mpeg" src={audio} />
      </audio>
    </div>
  );
}
