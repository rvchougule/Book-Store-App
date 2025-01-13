import { CiSearch } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import { categories } from "../assets/data";

import { books } from "../assets/data";
import BooksPagination from "../components/BooksPagination";
function Shop() {
  return (
    <>
      <section className="max-padd-container pt-24">
        <section>
          <div className="flex items-center justify-center rounded-full px-4  bg-primary max-w-[600px]">
            <CiSearch className="text-xl font-extrabold" />
            <input
              type="text"
              placeholder="search here..."
              className="w-full ring-0 outline-none py-2 bg-transparent px-2"
            />
            <LuSettings2 className="text-xl font-extrabold" />
          </div>
          {/* categories */}
          <div className="py-8">
            <h4 className="h4">Categories:</h4>
            <div className="flexCenter sm:flexStart gap-8 flex-wrap">
              {categories.map((category, i) => {
                return (
                  <div className=" cursor-pointer" key={i}>
                    <img
                      src={category.image}
                      alt=""
                      className="w-20 p-4 rounded-full bg-primary"
                    />
                    <h5 className="text-center pt-2">{category.name}</h5>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Books List */}
        <section>
          <div className="flexBetween gap-4">
            <div className="">
              <h2 className="h2">
                Our{" "}
                <span className="text-secondary !font-light">Books List</span>
              </h2>
              <p className="">
                From timeless classics to modern masterpieces, find the <br />{" "}
                perfect read for every moment
              </p>
            </div>
            <div className="">
              <label htmlFor="sort">Sort By:</label>
              <select
                name="sort"
                id="sort"
                className="mx-1 px-2 py-2 rounded-sm text-gray-30 bg-primary"
              >
                <option value="">Relevant</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <BooksPagination books={books} />
        </section>
      </section>
    </>
  );
}

export default Shop;
