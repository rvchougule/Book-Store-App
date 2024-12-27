import uploadIcon from "../assets/upload_icon.png";
import { useState } from "react";

const bookCategories = [
  "Fiction",
  "Non-Fiction",
  "Mystery & Thriller",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Biographies & Memoirs",
  "Self-Help",
  "Children's Books",
  "History",
  "Science & Technology",
  "Cookbooks",
  "Travel",
  "Health & Wellness",
  "Art & Photography",
  "Religion & Spirituality",
  "Education & Reference",
  "Comics & Graphic Novels",
  "Poetry",
  "Sports & Outdoors",
];

export default function AddItems() {
  // const [thumbnail, setThumbnail] = useState(null);

  // const [formData, setFormData] = useState({
  //   fullName: "",
  //   username: "",
  //   email: "",
  //   password: "",
  //   avatar: "",
  // });

  // const [errors, setErrors] = useState({
  //   fullName: "",
  //   username: "",
  //   email: "",
  //   password: "",
  //   avatar: "",
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const file = e.target.files?.[0];

  //   setErrors({
  //     fullName: "",
  //     username: "",
  //     email: "",
  //     password: "",
  //     avatar: "",
  //   });

  //   if (file) {
  //     console.log(file);
  //     setFormData((prevState) => ({ ...prevState, [name]: file }));
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setAvatar(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFormData((prevState) => ({ ...prevState, [name]: value }));
  //   }
  // };
  return (
    <div className="mx-8 mt-12 w-full">
      <form className="flex gap-8 w-full">
        <div className="flex flex-col gap-2 py-2  w-full">
          <div className="flex flex-col gap-2 py-2">
            <label htmlFor="title" className="text-lg font-semibold ">
              Product Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="write here..."
              className="py-1 px-2  rounded-md  "
            />
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label htmlFor="description" className="text-lg font-semibold">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="write here..."
              rows="4"
              className="py-2 px-2 rounded-md  "
            ></textarea>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label htmlFor="author" className="text-lg font-semibold ">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="write here..."
              className="py-1 px-2  rounded-md  "
              title="seperate the author with commas ( , )"
            />
          </div>
          <div className=" flex gap-8 py-2">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="category" className="text-lg font-semibold">
                Category
              </label>
              <select
                name="category"
                id="category"
                className="py-2 px-2 rounded-md "
              >
                <option hidden>select category</option>
                {bookCategories.map((category) => {
                  return (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-2 py-2">
              <label htmlFor="publisher" className="text-lg font-semibold ">
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                placeholder="write here..."
                className="py-1 px-2  rounded-md  "
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-8">
            <div className="w-[10rem] h-[10rem] flex items-center justify-center bg-white rounded-md cursor-pointer">
              <label htmlFor="uploadThumnail">
                <img src={uploadIcon} alt="uploadIcon" />
              </label>
              <input
                type="file"
                id="uploadThumnail"
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 py-2">
                <label
                  htmlFor="publishedDate"
                  className="text-lg font-semibold "
                >
                  Published Date
                </label>
                <input
                  type="date"
                  id="publishedDate"
                  name="publishedDate"
                  placeholder="write here..."
                  className="py-1 px-2  rounded-md  "
                />
              </div>
              <div className="flex flex-col gap-2 py-2">
                <label htmlFor="isbn" className="text-lg font-semibold ">
                  ISBN Code
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  placeholder="write here..."
                  className="py-1 px-2  rounded-md  "
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <label htmlFor="languages" className="text-lg font-semibold ">
              Languages
            </label>
            <input
              type="text"
              id="languages"
              name="languages"
              placeholder="write here..."
              className="py-1 px-2  rounded-md  "
              title="seperate the languages with commas ( , )"
            />
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label htmlFor="genre" className="text-lg font-semibold ">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              placeholder="write here..."
              className="py-1 px-2  rounded-md  "
            />
          </div>

          <div className=" flex gap-8 py-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="availableCopies"
                className="text-lg font-semibold "
              >
                Available Copies
              </label>
              <input
                type="number"
                id="availableCopies"
                name="availableCopies"
                min="0"
                className="py-1 px-2  rounded-md  "
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label htmlFor="pages" className="text-lg font-semibold ">
                Pages
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                min="0"
                className="py-1 px-2  rounded-md  "
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
