
// Khi click gửi. Nêu ở channel thì khi gửi sẽ nhận tin nhắn của server. 
// Còn private thì khi gửi mình nhận id message. Còn tin nhắn thì phải tự tạo.
// Còn người khác thì được nhận tin nhắn của mình.
async function SendMessage(
    hub,
    conversationId,
    message,
    setMessages,
    setIsNewMessage,
    user,
    scrollToBottom,
    isChannel,
    files
) {
    if (isChannel) {
        if (hub) {
            await hub.invoke("SendMessageAsync", {
                ReceiverId: conversationId,
                Content: message,
                IsChannel: true,
                Files: files,
            });
        }
        console.log("send message channel: ", message, hub);
        console.log("channel id: ", conversationId);
        return;
    }

    if (hub) {
        const data = await hub.invoke("SendMessageAsync", {
            ReceiverId: conversationId,
            Content: message,
            IsChannel: isChannel,
            Files: files,
        });
        setIsNewMessage(true);
        scrollToBottom();
        const message2 = {
            id: data,
            sendAt: new Date().toISOString(),
            senderName: user.firstName + " " + user.lastName ? user.lastName : "",
            senderId: localStorage.getItem("userId"),
            content: message,
            senderAvatar: user.picture,
            childCount: 0,
            reactionCount: {}
        };
        setMessages((messages) => [...messages, message2]);
    } else {
        console.error("Hub is not connected");
    }
}

export default SendMessage;