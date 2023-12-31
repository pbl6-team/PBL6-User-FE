import myFetch from "./myFetch";

export default async function getMessagesColleague(conversationId, time, count, parentId, isChannel, isBefore) {
   let params = `Count=${count}`;
   if (time) {
      params += `&TimeCursor=${time}`;
   }
   if (isChannel) {
      params += `&ToChannelId=${conversationId}`;
   }
   else {
      params += `&ToUserId=${conversationId}`;
   }
   if (parentId) {
      params += `&ParentId=${parentId}`;
   }
   if (isBefore === false) {
      console.log("isBefore: feofgii", isBefore)
      params += `&IsBefore=${false}`
   }
   
   const res = await myFetch({
      path: `Messages`,
      params: params,
      headers: {
         "accept": "text/plain",
      },
   })
   const status = res.status
   const data = await res.json()
   return data
}
