import { useState } from "react";
import { useGetCategoriesQuery } from "../../store/categorySlice";
import { useGetBooksQuery } from "../../store/bookSlice";
import { Trash2 } from "lucide-react";

function ListItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: categories } = useGetCategoriesQuery();
  const { data: booksData, isError, isLoading } = useGetBooksQuery();

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
      selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 w-full">
      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded-md sm:w-[40%]"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-md sm:w-[40%]"
        >
          <option value="All">All Categories</option>
          {categories?.data?.map((category) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Books List Section */}
      <div className="h-[90vh] overflow-y-scroll">
        <table className="border-separate border-spacing-y-4 w-full rounded-md">
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
                  className="bg-white border-2 border-black rounded-2xl"
                >
                  <td className="text-center px-2 py-2">
                    <img
                      src={book.thumbnail}
                      alt=""
                      className="sm:w-16 rounded-md"
                    />
                  </td>
                  <td className="px-2 py-2">{book.title}</td>
                  <td className="px-2 py-2">{book.category}</td>
                  <td className="px-2 py-2">{book.price || 0}</td>
                  <td className="flex gap-4 items-center justify-center p-2">
                    <Trash2 className="text-red-600 cursor-pointer" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListItems;
