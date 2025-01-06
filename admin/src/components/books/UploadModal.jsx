import { useState } from "react";
import { createPortal } from "react-dom";
import uploadIcon from "../../assets/upload_icon.png";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUpdateThumbnailMutation } from "../../store/bookSlice";

function UploadModal({
  uploadThumbnail,
  setUploadThumbnail,
  parentPosition,
  setUploadOpen,
  setDisplayBook,
}) {
  const [thumbnail, setThumbnail] = useState(uploadThumbnail.thumbnail);
  const [formData, setFormData] = useState(uploadThumbnail);
  const [errors, setErrors] = useState("");

  const [updateThumbnail] = useUpdateThumbnailMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const file = e.target.files?.[0];

    setErrors("");

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

    thumbnail: Yup.mixed()
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
      ),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    bookSchema
      .validate(formData, { abortEarly: false }) // Validate all fields at once
      .then(() => {
        const thumbnailData = new FormData();
        thumbnailData.append("thumbnail", formData.thumbnail); // Add the file

        for (const [key, value] of thumbnailData.entries()) {
          console.log("Setting");
          console.log(`${key}: ${value}`);
        }

        console.log(formData);

        updateThumbnail({
          id: formData._id, // Provide the ID
          body: thumbnailData, // Provide the FormData body
        })
          .then((res) => {
            console.log(res);
            if (res.error) {
              toast.error(res?.error?.data?.message);
            } else {
              const data = res?.data;
              toast.success(data?.message);
              setUploadThumbnail("");
              setDisplayBook("");
              setUploadOpen(false);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error(err);
          });
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
        setUploadOpen(!open);
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className=" flex flex-col gap-6 max-w-[80vw] sm:max-w-[60vw] lg:max-w-[30vw] rounded-md p-2 sm:p-6  mx-auto border-2 bg-white"
      >
        <h1 className="text-center font-bold">Upload Thumbnail</h1>
        {/* Upload Thumbnail */}
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-center bg-white rounded-md border cursor-pointer h-40 w-40 self-center mx-auto`}
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
            />
          </div>

          {errors?.thumbnail && (
            <p className="text-md text-red-700 my-1">{errors.thumbnail}</p>
          )}
        </div>
        <button
          className={`w-full bg-slate-500 p-2 rounded-md cursor-pointer ${
            !(typeof formData.thumbnail === "object") ? "opacity-30" : ""
          }`}
          disabled={typeof formData.thumbnail === "object" ? false : true}
        >
          Upload
        </button>
      </form>
    </div>,
    document.getElementById("portal")
  );
}

export default UploadModal;
