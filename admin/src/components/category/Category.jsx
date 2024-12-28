import { Delete, Edit, PlusSquareIcon } from "lucide-react";
import { useState } from "react";
import CategoryModal from "./CategoryModal";

const data = [
  {
    name: "drama",
    description: "drama based on thriller",
  },
];
function Category() {
  const [open, setOpen] = useState(false);
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
      <div className="">
        <table className="mt-4 w-full max-w-[900px] mx-auto  ">
          <thead>
            <tr className="bg-[#45237277]">
              <th className="border-l-2 border-r-2 p-2 ">Category Name</th>
              <th className="border-l-2 border-r-2 p-2 ">Description</th>
              <th className="border-l-2 border-r-2 p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((field, i) => {
              return (
                <tr key={i} className="border-b-2 border-[#45237277]">
                  <td className="text-center px-2 py-2">{field.name}</td>
                  <td className="px-2 py-2">{field.description}</td>
                  <td className="flex gap-4 items-center justify-center p-2">
                    <Edit className="text-green-700 cursor-pointer" />
                    <Delete className="text-red-600 cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {open && <CategoryModal open={open} setOpen={setOpen} />}
    </div>
  );
}

export default Category;
