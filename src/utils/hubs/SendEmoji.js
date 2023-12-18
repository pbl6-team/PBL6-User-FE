
async function SendEmoji(hub, messageId, emoji) {
    if (hub) {
        const data = await hub.invoke("ReactMessageAsync", {
            MessageId: messageId,
            Emoji: emoji,
        });
    } else {
        console.error("Hub is not connected");
    }
}

export default SendEmoji;