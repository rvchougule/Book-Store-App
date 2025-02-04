import OrderCard from "../components/OrderCard";
import useFooterBgColor from "../hooks/useFooterBgColor";
import { useGetOrdersQuery } from "../store/ordersSlice";

function Orders() {
  const {
    data: ordersList,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useGetOrdersQuery({ page: 1, query: "", limit: 50 });

  // Footer bg color setup
  useFooterBgColor();
  return (
    <section className="max-padd-container py-24 bg-primary ">
      <h3 className="h3">
        Order <span className="text-secondary !font-light">List</span>
      </h3>
      {isOrdersFetching || isOrdersLoading
        ? "Loading..."
        : ordersList?.data?.orders?.map((order, index) => {
            return (
              <div key={index}>
                <h5 className="h5">
                  {new Date(order.createdAt).toDateString()}
                </h5>
                {order?.books?.map((book, i) => {
                  return (
                    <OrderCard
                      key={i}
                      book={book}
                      status={order.status}
                      paymentMethod={order.paymentMethod}
                      date={new Date(order.createdAt).toDateString()}
                    />
                  );
                })}
              </div>
            );
          })}
    </section>
  );
}

export default Orders;
