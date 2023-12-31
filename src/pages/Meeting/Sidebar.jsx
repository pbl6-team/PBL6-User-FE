import { Plus } from "lucide-react"
import { CreateMeetingDialog } from "./CreateMeetingDialog"
import { useEffect, useState } from "react"
import getMeetings from "../../api/meeting/getMeetings"
import { Link, useParams } from "react-router-dom"
import convertTime from "../../utils/convertTime"
import { isBeforeCurrentDate } from "../../utils/compareCurrentTime"

function Sidebar() {
    const [meetings, setMeetings] = useState()
    const { workspaceId } = useParams()
    const [forceLoad, setForceLoad] = useState({})
    function loadData() {
        setForceLoad({})
    }
    useEffect(()=> {
        async function fetchData() {
            const res = await getMeetings(workspaceId)
            if(!res.ok) return
            setMeetings(res.data)
        }
        fetchData()
    },[forceLoad])
    return (
        <div className="w-72 border-r border-r-600 flex flex-col">
            {/* Header */}
            <div className="px-3 py-3 border-b border-b-gray-300 flex justify-between items-center">
                <h1 className="font-bold text-xl text-gray-700"> Meeting </h1>
                <CreateMeetingDialog loadData={loadData}>
                    <Plus className="w-7 h-7 stroke-[3px] stroke-gray-700 cursor-pointer p-1 hover:bg-gray-100 rounded"/>
                </CreateMeetingDialog>
            </div>

            {/* List meeting */}
            <div className=" flex flex-col overflow-y-auto h-full">
                {
                    meetings ? (
                        meetings.map(meeting=>(
                            <Link
                                key={meeting.id}
                                to={meeting.id} 
                                className="px-3 py-2 border-b border-b-gray-300 rounded-b-lg hover:bg-slate-50 cursor-pointer "
                            >
                                <div className="flex items-center">
                                    <h1 className="font-bold text-lg truncate"> {meeting.name} </h1>
                                    {
                                        isBeforeCurrentDate(meeting.timeStart) && !isBeforeCurrentDate(meeting.timeEnd) ? (
                                            <div className="ml-auto text-[10px] font-bold bg-green-600 rounded-full text-white px-[5px] py-[2px]">
                                                Live
                                            </div>
                                        ): 
                                        isBeforeCurrentDate(meeting.timeEnd) ? (
                                            <div className="ml-auto text-[10px] font-bold bg-red-600 rounded-full text-white px-[5px] py-[2px]">
                                                End
                                            </div>
                                        ): null
                                    }
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500"> 
                                        Meeting start: {convertTime(meeting.timeStart, true)} 
                                    </div>
                                    <div className="text-sm text-gray-500"> 
                                        Meeting end: {convertTime(meeting.timeEnd, true)} 
                                    </div>
                                </div>
                            </Link>  
                        ))
                    ) : ""
                }
            </div>
        </div>
    )
}
export { Sidebar }