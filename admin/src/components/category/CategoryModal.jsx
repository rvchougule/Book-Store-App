import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as Yup from "yup";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../store/categorySlice";
import { toast } from "react-toastify";

export default function CategoryModal({
  open,
  setOpen,
  editCategory,
  setEditCategory,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (editCategory) {
      setFormData(editCategory);
    }
  }, [editCategory]);

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({
      name: "",
      description: "",
    });

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const Schema = Yup.object().shape({
    name: Yup.string().required("Category name required"),
    description: Yup.string().required("Category description required"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Schema.validate(formData, { abortEarly: false })
      .then(() => {
        if (editCategory) {
          updateCategory(formData).then((res) => {
            if (res?.error) {
              toast.error(res?.error?.message);
            } else {
              const data = res?.data;
              toast.success(data.message);
            }
          });
          setEditCategory(false);
        } else {
          addCategory(formData).then((res) => {
            if (res?.error) {
              toast.error(res?.error?.message);
            } else {
              const data = res?.data;
              toast.success(data.message);
            }
          });
        }
        setOpen(!open);
      })
      .catch((err) => {
        const formattedErrors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });
  };
  return createPortal(
    <div
      className="absolute top-0 left-0 w-full h-full bg-[#5a5a5aa4]"
      onClick={() => {
        setFormData({
          name: "",
          description: "",
        });
        setOpen(!open);
      }}
    >
      <div className=" h-full w-full flex items-center justify-center  ">
        <form
          action=""
          className="bg-white p-8 rounded-lg flex  flex-col gap-4"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-[#452372b6] font-bold text-2xl border-b-2 border-[#45237277]">
            New Category
          </h1>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="name" className="text-lg font-semibold">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Write here..."
              className="py-2 px-4 rounded-md border"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="text-md text-red-700 my-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="description" className="text-lg font-semibold">
              Category Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Write here..."
              className="py-2 px-4 rounded-md border"
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <p className="text-md text-red-700 my-1">{errors.description}</p>
            )}
          </div>
          <button className="w-full bg-[#45237277] p-2 rounded-md">
            {editCategory ? "Add" : "Edit"} Category
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
