async function UpdateMessage(hub, messageId, message, isChannel) {
    if (hub) {
        const data = await hub.invoke("UpdateMessageAsync", {
            id: messageId,
            Content: message,
            IsChannel: isChannel,
        });
    } else {
        console.error("Hub is not connected");
    }
}

export default UpdateMessage;