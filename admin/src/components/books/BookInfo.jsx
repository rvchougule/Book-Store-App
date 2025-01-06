/* eslint-disable react/prop-types */
import { Cross, FileEditIcon } from "lucide-react";

function BookInfo({
  displayBook,
  setDisplayBook,
  setUploadOpen,
  setUploadThumbnail,
}) {
  return (
    <div className="absolute lg:static top-12  left-0 sm:left-auto sm:h-[90vh] sm:overflow-y-scroll sm:scrollbar-hide sm:right-2 mx-2 sm:w-1/2 lg:block  lg:w-1/3 lg:my-4 border-2 border-[#45237277] p-4 rounded-md bg-white">
      <div className="absolute top-2 right-2 cursor-pointer lg:hidden z-10">
        <Cross className="rotate-45" onClick={() => setDisplayBook("")} />
      </div>
      <div className="relative group">
        <img
          src={displayBook.thumbnail}
          alt=""
          className="mx-auto sm:max-h-[30vh]"
        />
        <div
          onClick={() => {
            setUploadOpen(true);
            setUploadThumbnail(displayBook);
          }}
          className="absolute bottom-2 right-2 bg-slate-500 p-4 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FileEditIcon className="" />
        </div>
      </div>
      <h1 className="text-center font-bold text-2xl py-2">
        {displayBook.title}
      </h1>
      <div className="flex flex-col gap-2 font-bold">
        <h4 className="">Author : {displayBook.author.join(",")}</h4>
        <h4 className="">Description : {displayBook.description}</h4>
        <h4 className="">Category : {displayBook.categories.join(",")}</h4>
        <h4 className="">Languages : {displayBook.languages.join(",")}</h4>
        <h4 className="">ISBN : {displayBook.isbn}</h4>
        <h4 className="">Genre : {displayBook.genre}</h4>
        <h4 className="">Publisher : {displayBook.publisher}</h4>
        <h4 className="">
          Published Date : {displayBook.publishedDate.slice(0, 10)}
        </h4>
        <h4 className="">Available Copies : {displayBook.availableCopies}</h4>
        <h4 className="">Pages : {displayBook.pages}</h4>
        <h4 className="">Price : {displayBook.price || 0}</h4>
      </div>
    </div>
  );
}

export default BookInfo;
