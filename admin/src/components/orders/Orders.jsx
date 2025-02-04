import { useState } from "react";
import { useGetOrdersQuery } from "../../store/orderSlice";
import ParentOrderCard from "./ParentOrderCard";
import BeatLoader from "react-spinners/BeatLoader";

function Orders() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const {
    data: ordersList,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useGetOrdersQuery({ limit: 30, query: query, status: filter });

  return (
    <section className="max-padd-container py-12 px-16 bg-primary ">
      <h3 className="text-2xl font-bold mb-8">
        Order <span className="text-secondary !font-light">List</span>
      </h3>
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:items-center  justify-between">
        <input
          type="text"
          placeholder="Search orders..."
          value={query}
          onChange={(e) => setQuery(e.target.value.trim())}
          className="p-2 border rounded-md  sm:w-[40%]"
          title="search based on user name, email and the city"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md sm:w-[40%]"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isOrdersFetching || isOrdersLoading ? (
        <div className="text-center my-20">
          <BeatLoader
            color="#ffbcb1"
            loading="true"
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        ordersList?.data?.orders?.map((order, index) => {
          return <ParentOrderCard key={index} order={order} />;
        })
      )}
    </section>
  );
}

export default Orders;
