import { Link } from "react-router";
import { assets, Features } from "../assets/data";
import Slider from "../components/Slider";
import { TbTruckReturn } from "react-icons/tb";

const bookStoreFeatures = [
  {
    title: "Easy Returns Process",
    description:
      "We offer a hassle-free returns process, ensuring your satisfaction with every purchase. If you're not completely happy with your order, you can return it quickly and easily.",
  },
  {
    title: "Secure Payment Options",
    description:
      "Shop with confidence using our secure payment options. We prioritize your safety by providing encrypted payment gateways for a smooth and worry-free transaction experience.",
  },
  {
    title: "Live Customer Support",
    description:
      "Our dedicated customer support team is available to assist you anytime. Get real-time help for your questions or concerns, ensuring a seamless shopping experience.",
  },
];

function Home() {
  return (
    <>
      <section id="hero-container" className="bg-primary py-20 xl:py-36">
        <div className="bg-transparent pt-[10vh] max-padd-container flexBetween flex-col xl:flex-row  gap-x-12">
          {/* Left Section */}
          <div className="xl:w-1/2 ">
            <h1 className="h1">
              Discover{" "}
              <span className="inline-flex  items-center ">
                <span className="inline-block px-4 rounded-full text-white bg-secondary transform -rotate-45 mr-1">
                  B
                </span>
                ooks
                <img src={assets.pencil} className="inline w-20 px-2" />
              </span>
              That Inspire Your World
            </h1>
            <p className="mb-8">
              Explore a world of stories, knowledge, and inspiration. Discover
              books that ignite your imagination, broaden your perspective, and
              enrich your journey. From timeless classics to modern
              masterpieces, find the perfect read for every moment
            </p>

            <Link to="/shop" className="btn-secondaryOne ">
              Explore Now
            </Link>
          </div>

          {/* Right Section */}
          <div className="xl:w-1/2">
            <img
              src={assets.bg}
              alt=""
              className="bg-transparent mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="max-padd-container py-16 bg-white">
        <h2 className="h2">
          New <span className="text-secondary !font-light">Arrivals</span>
        </h2>
        <p className="">
          From timeless classics to modern masterpieces, find the <br /> perfect
          read for every moment
        </p>
        <Slider />
      </section>

      <section className="bg-primary">
        <div className="flexBetween flex-col xl:flex-row gap-4 max-padd-container py-16 px-16">
          <div className="xl:px-16">
            <h1 className="h2">
              Unveiling Our{" "}
              <span className="font-light">Store&apos;s key features!</span>
            </h1>
            <p>
              From timeless classics to modern masterpieces, find the
              <br /> perfect read for every moment
            </p>

            <div className="py-8">
              {bookStoreFeatures.map((feature, i) => (
                <div className="flexStart gap-x-2 py-2" key={i}>
                  <div className="text-3xl p-4 bg-secondaryOne rounded-lg">
                    <TbTruckReturn className="" />
                  </div>
                  <div className="">
                    <h5 className="h5">{feature.title}</h5>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* book image */}
          <div className=" xl:mx-24 p-12 xl:p-24  rounded-3xl bg-secondaryOne">
            <img src={assets.book_1} alt="" className="rounded-lg" />
          </div>
        </div>
      </section>

      <section className="max-padd-container py-16 bg-white">
        <h2 className="h2">
          Popular <span className="text-secondary !font-light">Books</span>
        </h2>
        <p className="">
          From timeless classics to modern masterpieces, find the <br /> perfect
          read for every moment
        </p>
        <Slider />
      </section>

      <section className="bg-primary py-16">
        <div className="max-padd-container flexCenter flex-wrap xl:flex-nowrap gap-6">
          {Features.map((feature, i) => (
            <div
              className="flex flex-col items-center justify-center gap-2 "
              key={i}
            >
              <img src={feature.icon} alt="" className="w-16 " />
              <h4 className="h4 ">{feature.title}</h4>
              <hr className="w-8 h-[4px] bg-secondary rounded-full -mt-4" />
              <p className="text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
