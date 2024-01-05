import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import getMeetingById from "../../api/meeting/getMeetingById";
import { Check, Loader2, Trash, Video } from "lucide-react";
import convertTime from "../../utils/convertTime";
import { Button } from "@/components/ui/button";
import joinMeeting from "../../api/meeting/joinMeeting";
import { isBeforeCurrentDate } from "../../utils/compareCurrentTime";
import { CreateMeetingDialog } from "./CreateMeetingDialog";
import { useToast } from "@/components/ui/use-toast"
import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import deleteMeeting from "../../api/meeting/deleteMeeting";


function MeetingDetail() {
   const loadData = useOutletContext();
   const { meetingId } = useParams();
   const [meeting, setMeeting] = useState();
   const navigate = useNavigate();
   const [forceLoad, setForceLoad] = useState();
   const {toast} = useToast()
   function loadMeeting() {
      setForceLoad({});
   }
   useEffect(() => {
      async function fetchData() {
         const res = await getMeetingById(meetingId);
         if (!res.ok) return;
         setMeeting(res.data);
      }
      fetchData();
   }, [meetingId, forceLoad]);
   if (!meeting) return <div></div>;
   return (
      <div className="px-5 w-full">
         <div className="flex items-center gap-3 border-b border-b-gray-300 py-3">
            <Video className="border border-gray-300 rounded p-1 w-7 h-7 stroke-gray-500" />
            <h1 className="text-lg font-bold">{meeting.name}</h1>
            <div>
               {isBeforeCurrentDate(meeting.timeStart) && !isBeforeCurrentDate(meeting.timeEnd) ? (
                  <div className="ml-auto text-[10px] font-bold bg-green-600 rounded-full text-white px-[8px] py-[2px]">
                     Live
                  </div>
               ) : isBeforeCurrentDate(meeting.timeEnd) ? (
                  <div className="ml-auto text-[10px] font-bold bg-red-600 rounded-full text-white px-[10px] py-[2px]">
                     End
                  </div>
               ) : null}
            </div>
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Trash className="ml-auto stroke-red-500 cursor-pointer" />
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle> Are you sure delete this meeting </AlertDialogTitle>
                     <AlertDialogDescription>
                        After delete meeting, you will never meet it again. So carefully your choice
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel> Cancel </AlertDialogCancel>
                     <Button
                        className="delete-but"
                        onClick={async (e) => {
                           document.querySelector(".delete-but").disabled = true;
                           document.querySelector(".delete-loader").classList.toggle("hidden");
                           const res = await deleteMeeting(meeting.id);
                           if (res.ok) {
                              loadData()
                              navigate("..",{relative: "path"})
                              toast({
                                 title: (
                                    <p className="flex items-center"> 
                                       <Check className="stroke-green-500 w-6 h-6 stroke-[3] mr-2"/> 
                                       Delete successfully
                                    </p>
                                 )
                                 
                              })
                              return
                           }
                           toast({
                              title: (
                                 <p className="flex items-center"> 
                                    <X className="stroke-red-500 w-6 h-6 stroke-[3] mr-2"/> 
                                    Something went wrong, please try again
                                 </p>
                              )
                           })
                           document.querySelector(".delete-but").disabled = true;
                           document.querySelector(".delete-loader").classList.toggle("hidden");
                        }}
                     >
                        <Loader2 className="delete-loader w-4 h-4 mr-2 animate-spin hidden" />
                        Delete
                     </Button>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         </div>
         <div className="border border-gray-200 inline-block px-7 pt-5 pb-3 rounded-lg mt-5 max-w-[500px]">
            {meeting.description !== "" ? (
               <div>
                  <span className="text-lg font-semibold"> Description: </span>
                  <p className="break-words text-gray-500"> {meeting.description} </p>
               </div>
            ) : null}
            <div className="">
               <div>
                  <span className="text-lg font-semibold"> Time Start: </span>
                  <span className="text-lg text-gray-500"> {convertTime(meeting.timeStart, true)} </span>
               </div>
               <div>
                  <span className="text-lg font-semibold"> Time End: </span>
                  <span className="text-lg text-gray-500"> {convertTime(meeting.timeEnd, true)} </span>
               </div>
            </div>
            <div className="mt-5 flex justify-end items-center">
               <CreateMeetingDialog editData={meeting} loadData={loadData} loadMeeting={loadMeeting}>
                  <Button variant="link" className="text-md font-bold">
                     Edit
                  </Button>
               </CreateMeetingDialog>

               {isBeforeCurrentDate(meeting.timeStart) && !isBeforeCurrentDate(meeting.timeEnd) ? (
                  <button
                     className="px-3 font-semibold bg-black text-white text-md rounded flex items-center"
                     onClick={async (e) => {
                        const butEle = e.currentTarget;
                        butEle.disabled = true;
                        butEle.classList.replace("bg-black", "bg-gray-300");
                        butEle.querySelector(".loader").classList.remove("hidden");
                        navigate("room");
                     }}
                  >
                     <Loader2 className="loader w-4 h-4 animate-spin hidden mr-2" />
                     Join
                  </button>
               ) : null}
            </div>
         </div>
      </div>
   );
}
export { MeetingDetail };
