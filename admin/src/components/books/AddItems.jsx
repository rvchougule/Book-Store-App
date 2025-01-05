import { toast } from "react-toastify";
import uploadIcon from "../../assets/upload_icon.png";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  useAddBookMutation,
  useUpdateBookMutation,
} from "../../store/bookSlice";
import { useGetCategoriesQuery } from "../../store/categorySlice";
import { createPortal } from "react-dom";

const fields = {
  title: "",
  thumbnail: "",
  description: "",
  author: "",
  category: "",
  publisher: "",
  languages: "",
  genre: "",
  publishedDate: "",
  isbn: "",
  availableCopies: "",
  pages: "",
  price: "",
};

export default function AddItems({
  open,
  setOpen,
  parentPosition,
  editBook,
  setEditBook,
}) {
  const [thumbnail, setThumbnail] = useState(null);
  const [formData, setFormData] = useState({ ...fields });
  const [errors, setErrors] = useState({ ...fields });

  const { data } = useGetCategoriesQuery();
  const [addBook] = useAddBookMutation();
  const [updateBook] = useUpdateBookMutation();

  useEffect(() => {
    if (editBook) {
      setFormData({
        _id: editBook._id,
        title: editBook.title,
        author: editBook.author?.join(","),
        genre: editBook.genre,
        publishedDate: editBook.publishedDate,
        isbn: editBook.isbn,
        pages: editBook.pages,
        languages: editBook.languages?.join(","),
        description: editBook.description,
        publisher: editBook.publisher,
        thumbnail: editBook.thumbnail,
        availableCopies: editBook.availableCopies,
        category: editBook.category?.join(","),
        price: editBook.price,
      });
      setThumbnail(editBook.thumbnail);
    }
  }, [editBook]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const file = e.target.files?.[0];

    setErrors({ ...fields });

    if (file) {
      setFormData((prevState) => ({ ...prevState, [name]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const bookSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),

    thumbnail: !editBook
      ? Yup.mixed()
          .required("Thumbnail is required")
          .test(
            "is-file",
            "Thumbnail is required",
            (value) => value instanceof File
          )
          .test("file-type", "Only image files are allowed", (value) =>
            value
              ? ["image/jpeg", "image/png", "image/gif"].includes(value.type)
              : false
          )
          .test("file-size", "File size must be less than 2MB", (value) =>
            value ? value.size <= 2 * 1024 * 1024 : false
          )
      : "",

    description: Yup.string().required("Description is required"),
    author: Yup.string().required("Author is required"),
    category: Yup.string().required("Category is required"),
    publisher: Yup.string().required("Publisher is required"),
    languages: Yup.string().required("Language is required"),
    genre: Yup.string().required("Genre is required"),
    publishedDate: Yup.date()
      .typeError("Published Date must be a valid date")
      .required("Published Date is required"),
    isbn: Yup.string()
      .matches(/^\d{13}$/, "ISBN must be a 13-digit number")
      .required("ISBN is required"),
    availableCopies: Yup.number()
      .integer("Available Copies must be an integer")
      .min(0, "Available Copies cannot be negative")
      .required("Available Copies is required"),
    pages: Yup.number()
      .integer("Pages must be an integer")
      .min(1, "Pages must be at least 1")
      .required("Pages are required"),
    price: Yup.number()
      .integer("Pages must be an integer")
      .min(1, "Pages must be at least 1")
      .required("Pages are required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    bookSchema
      .validate(formData, { abortEarly: false }) // Validate all fields at once
      .then(() => {
        const bookData = new FormData();

        bookData.append("_id", formData._id);
        bookData.append("title", formData.title);
        if (!editBook) {
          bookData.append("thumbnail", formData.thumbnail); // Add the file
        }
        bookData.append("description", formData.description);
        bookData.append("author", formData.author.split(","));
        bookData.append("category", formData.category);
        bookData.append("publisher", formData.publisher);
        bookData.append("languages", formData.languages.split(","));
        bookData.append("genre", formData.genre);
        bookData.append("publishedDate", formData.publishedDate);
        bookData.append("isbn", formData.isbn);
        bookData.append("availableCopies", formData.availableCopies);
        bookData.append("pages", formData.pages);
        bookData.append("price", formData.price);

        if (editBook) {
          updateBook(formData._id, bookData)
            .then((res) => {
              if (res.error) {
                toast.error(res?.error?.data?.message);
              } else {
                const data = res?.data;
                toast.success(data?.message);
                setFormData({ ...fields });
                setThumbnail(null);
                setEditBook("");
                setOpen(false);
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error(err);
            });
        } else {
          addBook(bookData)
            .then((res) => {
              if (res.error) {
                toast.error(res?.error?.data?.message);
              } else {
                const data = res?.data;
                toast.success(data?.message);
                setFormData({ ...fields });
                setThumbnail(null);
                setOpen(false);
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error(err);
            });
        }
      })
      .catch((err) => {
        const formattedErrors = err?.inner?.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });

    //
  };
  return createPortal(
    <div
      className="h-[100vh] overflow-y-scroll absolute top-0 left-0 px-4 sm:px-8 py-12 w-full backdrop-blur-md "
      style={{
        top: `${parentPosition.top}px`,
        left: `${parentPosition.left}px`,
        width: `${parentPosition.width}px`,
      }}
      onClick={() => {
        setEditBook("");
        setOpen(!open);
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="grid  sm:grid-cols-2 gap-6 max-w-[80vw] sm:max-w-[60vw] rounded-md p-2 sm:p-6  mx-auto border-2 bg-white"
      >
        {/* Product Name */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="title" className="text-lg font-semibold">
            Product Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Write here..."
            className="py-2 px-4 rounded-md border"
            value={formData.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <p className="text-md text-red-700 my-1">{errors.title}</p>
          )}
        </div>
        {/* Upload Thumbnail */}
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-center bg-white rounded-md border cursor-${
              editBook ? "not-allowed" : "pointer"
            } h-40 w-40 self-center mx-auto`}
          >
            <label htmlFor="thumbnail" className="h-full w-full">
              <img
                src={thumbnail ? thumbnail : uploadIcon}
                alt="Upload Icon"
                className="h-full w-full object-contain rounded-md"
              />
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              className="hidden"
              name="thumbnail"
              onChange={handleInputChange}
              disabled={editBook ? true : false}
            />
          </div>

          {errors.thumbnail && (
            <p className="text-md text-red-700 my-1">{errors.thumbnail}</p>
          )}
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-2 ">
          <label htmlFor="description" className="text-lg font-semibold">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Write here..."
            rows="4"
            className="py-2 px-4 rounded-md border"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
          {errors.description && (
            <p className="text-md text-red-700 my-1">{errors.description}</p>
          )}
        </div>

        {/* Author */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="author" className="text-lg font-semibold">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="Write here..."
            className="py-2 px-4 rounded-md border"
            title="Separate authors with commas ( , )"
            value={formData.author}
            onChange={handleInputChange}
          />
          {errors.author && (
            <p className="text-md text-red-700 my-1">{errors.author}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-lg font-semibold">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="py-2 px-4 rounded-md border"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option hidden>Select category</option>
            {data?.data?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-md text-red-700 my-1">{errors.category}</p>
          )}
        </div>

        {/* Publisher */}
        <div className="flex flex-col gap-2">
          <label htmlFor="publisher" className="text-lg font-semibold">
            Publisher
          </label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            placeholder="Write here..."
            className="py-2 px-4 rounded-md border"
            value={formData.publisher}
            onChange={handleInputChange}
          />
          {errors.publisher && (
            <p className="text-md text-red-700 my-1">{errors.publisher}</p>
          )}
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-2">
          <label htmlFor="languages" className="text-lg font-semibold">
            Languages
          </label>
          <input
            type="text"
            id="languages"
            name="languages"
            placeholder="Write here..."
            className="py-2 px-4 rounded-md border"
            title="Separate languages with commas ( , )"
            value={formData.languages}
            onChange={handleInputChange}
          />
          {errors.languages && (
            <p className="text-md text-red-700 my-1">{errors.languages}</p>
          )}
        </div>

        {/* Genre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="genre" className="text-lg font-semibold">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            placeholder="Write here..."
            className="py-2 px-4 rounded-md border"
            value={formData.genre}
            onChange={handleInputChange}
          />
          {errors.genre && (
            <p className="text-md text-red-700 my-1">{errors.genre}</p>
          )}
        </div>

        {/* Published Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="publishedDate" className="text-lg font-semibold">
            Published Date
          </label>
          <input
            type="date"
            id="publishedDate"
            name="publishedDate"
            className="py-2 px-4 rounded-md border"
            value={
              formData.publishedDate
                ? new Date(formData.publishedDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
          />
          {errors.publishedDate && (
            <p className="text-md text-red-700 my-1">{errors.publishedDate}</p>
          )}
        </div>

        {/* ISBN Code */}
        <div className="flex flex-col gap-2">
          <label htmlFor="isbn" className="text-lg font-semibold">
            ISBN Code
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            placeholder="Write here..."
            className="py-2 px-4 rounded-md border"
            value={formData.isbn}
            onChange={handleInputChange}
          />
          {errors.isbn && (
            <p className="text-md text-red-700 my-1">{errors.isbn}</p>
          )}
        </div>

        {/* Available Copies */}
        <div className="flex flex-col gap-2">
          <label htmlFor="availableCopies" className="text-lg font-semibold">
            Available Copies
          </label>
          <input
            type="number"
            id="availableCopies"
            name="availableCopies"
            min="0"
            className="py-2 px-4 rounded-md border"
            value={formData.availableCopies}
            onChange={handleInputChange}
          />
          {errors.availableCopies && (
            <p className="text-md text-red-700 my-1">
              {errors.availableCopies}
            </p>
          )}
        </div>

        {/* Pages */}
        <div className="flex flex-col gap-2">
          <label htmlFor="pages" className="text-lg font-semibold">
            Pages
          </label>
          <input
            type="number"
            id="pages"
            name="pages"
            min="0"
            className="py-2 px-4 rounded-md border"
            value={formData.pages}
            onChange={handleInputChange}
          />
          {errors.pages && (
            <p className="text-md text-red-700 my-1">{errors.pages}</p>
          )}
        </div>

        {/* price */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-lg font-semibold">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            className="py-2 px-4 rounded-md border"
            value={formData.price}
            onChange={handleInputChange}
          />
          {errors.pages && (
            <p className="text-md text-red-700 my-1">{errors.price}</p>
          )}
        </div>
        <button className="sm:col-span-2 bg-violet-950 p-2 text-white rounde-md">
          {editBook ? "Update" : "Add"} Item
        </button>
      </form>
    </div>,
    document.getElementById("portal")
  );
}
