import { Delete, Edit, PlusSquareIcon } from "lucide-react";
import { useState } from "react";
import CategoryModal from "./CategoryModal";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../store/categorySlice";
import { toast } from "react-toastify";

function Category() {
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const EditCategory = (field) => {
    setEditCategory(field);
    setOpen(true);
  };

  // Delete Category
  const deleteController = (field) => {
    deleteCategory(field._id).then((res) => {
      if (res?.error) {
        toast.error(res?.error?.message);
      } else {
        const data = res?.data;
        toast.success(data.message);
      }
    });
  };
  return (
    <div className="flex flex-col w-full h-[100vh] overflow-scroll scrollbar-hide px-8 py-8">
      {/* header */}
      <div className="flex items-center justify-end">
        <button
          className="flex gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <PlusSquareIcon /> <span className="font-bold">Add</span>
        </button>
      </div>

      {/* body:table */}
      <div>
        <table className="mt-4 w-full max-w-[900px] mx-auto">
          <thead>
            <tr className="bg-[#45237277]">
              <th className="border-l-2 border-r-2 p-2 ">Category Name</th>
              <th className="border-l-2 border-r-2 p-2 ">Description</th>
              <th className="border-l-2 border-r-2 p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Something went wrong!
                </td>
              </tr>
            ) : isLoading || isFetching ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No categories found.
                </td>
              </tr>
            ) : (
              data?.data?.map((field, i) => (
                <tr key={i} className="border-b-2 border-[#45237277]">
                  <td className="text-center px-2 py-2">{field.name}</td>
                  <td className="px-2 py-2">{field.description}</td>
                  <td className="flex gap-4 items-center justify-center p-2">
                    <Edit
                      onClick={() => EditCategory(field)}
                      className="text-green-700 cursor-pointer"
                    />
                    <Delete
                      onClick={() => deleteController(field)}
                      className="text-red-600 cursor-pointer"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {open && (
        <CategoryModal
          open={open}
          setOpen={setOpen}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
        />
      )}
    </div>
  );
}

export default Category;
