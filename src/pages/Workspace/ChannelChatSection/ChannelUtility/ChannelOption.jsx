import { useState } from "react";
import Assets from "./Assets";
import { GoPin } from "react-icons/go";
import { IoPeopleOutline } from "react-icons/io5";
export default function ChannelOption(props) {
  const [showAssets, setShowAssets] = useState(false);
  return (
    <>
      <div className="font-medium py-2 px-5 border-b-2 border-gray-300 text-slate-700 text-base">
        # channel 1
      </div>

      {/* Pinned Message */}
      <div
        className="flex flex-row  pl-5 py-2 mt-2 cursor-pointer group text-gray-600 hover:bg-slate-100"
        onClick={() => props.setSelectedOption("pinnedMessageList")}
      >
        <GoPin className="w-6 h-6 text-gray-600 " />
        <span className="text-sm ml-3 relative top-0.5 font-medium select-none">
          Pinned messages
        </span>
      </div>
      {/* All Member */}
      <div
        className="flex flex-row pl-5 py-2 cursor-pointer group text-gray-600 hover:bg-slate-100"
        onClick={() => props.setSelectedOption("allMember")}
      >
        <IoPeopleOutline className="w-6 h-6 text-gray-600 " />
        <span className="text-sm ml-3 relative top-0.5 font-medium select-none">
          All memmber
        </span>
      </div>
      {/* Media, files, links */}
      <div
        className="flex flex-row pl-5 py-2 cursor-pointer group  text-gray-600 hover:bg-slate-100"
        onClick={() => setShowAssets(!showAssets)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className={`w-6 h-6 py-1 text-gray-600  transform transition-transform duration-200 ${showAssets ? 'rotate-90' : ''}`}
        >
          <path
            fill="currentColor"
            d="M8.489 31.975a1.073 1.073 0 01-.757-1.831L21.99 15.88 7.94 1.83c-.417-.417-.417-1.098 0-1.515s1.098-.417 1.515 0l14.807 14.807a1.074 1.074 0 010 1.515L9.247 31.659a1.078 1.078 0 01-.757.316z"
          ></path>
        </svg>
        <span className="text-sm ml-3 relative top-0.5 font-medium select-none">
          Media, files, links
        </span>
      </div>
      {/* Assets */}
      {showAssets && <Assets setSelectedOption={props.setSelectedOption}/>}

      {/* Channel setting */}
      <div className="flex flex-row pl-5 py-2 cursor-pointer group text-gray-600 hover:bg-slate-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          className="w-6 h-6 py-0.5 text-gray-600 "
        >
          <path
            fill="currentColor"
            d="M600.704 64a32 32 0 0130.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0134.432 15.36L944.32 364.8a32 32 0 01-4.032 37.504l-77.12 85.12a357.12 357.12 0 010 49.024l77.12 85.248a32 32 0 014.032 37.504l-88.704 153.6a32 32 0 01-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 01600.704 960H423.296a32 32 0 01-30.464-22.208L357.696 828.48a351.616 351.616 0 01-42.56-24.64l-112.32 24.256a32 32 0 01-34.432-15.36L79.68 659.2a32 32 0 014.032-37.504l77.12-85.248a357.12 357.12 0 010-48.896l-77.12-85.248A32 32 0 0179.68 364.8l88.704-153.6a32 32 0 0134.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 01423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 00-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 000 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0034.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0034.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 000-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 00-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 110 384 192 192 0 010-384zm0 64a128 128 0 100 256 128 128 0 000-256z"
          ></path>
        </svg>
        <span className="text-sm ml-3 relative top-0.5 font-medium select-none">
          Channel setting
        </span>
      </div>
    </>
  );
}
