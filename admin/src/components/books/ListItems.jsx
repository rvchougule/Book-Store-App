import { useEffect, useRef, useState } from "react";
import { useGetCategoriesQuery } from "../../store/categorySlice";
import { useDeleteBookMutation, useGetBooksQuery } from "../../store/bookSlice";
import { Edit, PlusSquare, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import AddItems from "./AddItems";

function ListItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayBook, setDisplayBook] = useState("");
  const [open, setOpen] = useState(false);
  const parentRef = useRef(null); // Reference to the parent
  const [parentPosition, setParentPosition] = useState({});

  const { data: categories } = useGetCategoriesQuery();
  const { data: booksData, isError, isLoading } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const [editBook, setEditBook] = useState("");

  useEffect(() => {
    if (open && parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setParentPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [open]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBooks = booksData?.data?.books?.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      book.categories.join(",").toLowerCase() ===
        selectedCategory.toLocaleLowerCase();
    return matchesSearch && matchesCategory;
  });

  // book delete fn
  const handleDelete = (id) => {
    deleteBook(id)
      .then((res) => {
        if (res.error) {
          toast.error(res?.error?.data?.message);
        } else {
          const data = res?.data;
          toast.success(data?.message);
        }
        if (displayBook._id === id) {
          setDisplayBook("");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  return (
    <div className="p-4 w-full " ref={parentRef}>
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:items-center  justify-between">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded-md  sm:w-[40%]"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-md sm:w-[40%]"
        >
          <option value="">All Categories</option>
          {categories?.data?.map((category) => (
            <option value={category.name} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex w-full  items-center justify-end">
        <button
          className="flex gap-2  font-bold self-end p-2 sm:p-4 bg-[#45237277] rounded-md cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <PlusSquare /> Add
        </button>
      </div>

      {/* Books List Section */}
      <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
        <div
          className={`h-[90vh] overflow-y-scroll scrollbar-hide ${
            displayBook ? "lg:w-2/3" : "w-full"
          } w-full`}
        >
          <table className="border-separate border-none border-spacing-y-4 w-full rounded-md text-xs sm:text-lg">
            <thead className="sticky top-0 bg-white ">
              <tr className="rounded-3xl">
                <th className="p-2 ">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Something went wrong!
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredBooks?.map((book) => (
                  <tr
                    key={book._id}
                    className={` border-2 border-black rounded-2xl cursor-pointer  ${
                      displayBook._id === book._id
                        ? "bg-white lg:bg-[#6968695d]"
                        : "bg-white"
                    }`}
                    onClick={() => setDisplayBook(book)}
                  >
                    <td className="text-center px-2 py-2">
                      <img
                        src={book.thumbnail}
                        alt=""
                        className="sm:w-16 rounded-md"
                      />
                    </td>
                    <td className="px-2 py-2 ">{book.title}</td>
                    <td className="px-2 py-2 text-center">{book.categories}</td>
                    <td className="px-2 py-2 text-center">{book.price}</td>
                    <td className=" p-2 ">
                      <Edit
                        className="text-green-600 cursor-pointer inline-block sm:m-4"
                        onClick={() => {
                          setEditBook(book);
                          setOpen(true);
                        }}
                      />
                      <Trash2
                        className="text-red-600 cursor-pointer inline-block "
                        onClick={() => handleDelete(book._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Display book */}
        {displayBook && (
          <div className="hidden lg:block w-full sm:w-1/3 my-4 border-2 border-[#45237277] p-4 rounded-md bg-white">
            <div className="">
              <img
                src={displayBook.thumbnail}
                alt=""
                className="mx-auto sm:max-h-[30vh]"
              />
              <h1 className="text-center font-bold text-2xl py-2">
                {displayBook.title}
              </h1>
            </div>
            <div className="flex flex-col gap-2 font-bold">
              <h4 className="">Author : {displayBook.author.join(",")}</h4>
              <h4 className="">Description : {displayBook.description}</h4>
              <h4 className="">
                Category : {displayBook.categories.join(",")}
              </h4>
              <h4 className="">
                Languages : {displayBook.languages.join(",")}
              </h4>
              <h4 className="">ISBN : {displayBook.isbn}</h4>
              <h4 className="">Genre : {displayBook.genre}</h4>
              <h4 className="">Publisher : {displayBook.publisher}</h4>
              <h4 className="">
                Published Date : {displayBook.publishedDate.slice(0, 10)}
              </h4>
              <h4 className="">
                Available Copies : {displayBook.availableCopies}
              </h4>
              <h4 className="">Pages : {displayBook.pages}</h4>
              <h4 className="">Price : {displayBook.price || 0}</h4>
            </div>
          </div>
        )}
      </div>
      {open && (
        <AddItems
          open={open}
          setOpen={setOpen}
          parentPosition={parentPosition}
          editBook={editBook}
          setEditBook={setEditBook}
        />
      )}
    </div>
  );
}

export default ListItems;
