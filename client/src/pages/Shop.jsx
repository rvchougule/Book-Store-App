import { CiSearch } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import { categories } from "../assets/data";
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

          {/*  */}
        </section>
      </section>
    </>
  );
}

export default Shop;
