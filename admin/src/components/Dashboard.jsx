import { useGetDashBoardDataQuery } from "../store/authSlice";

export default function Dashboard() {
  const { data, isLoading, isFetching, isError } = useGetDashBoardDataQuery();

  const items = data?.data;
  const boxData = [
    {
      name: "Total Books",
      source: items?.totalBooks,
      color: "#1E88E5",
    },
    {
      name: "Total Users",
      source: items?.totalUsers,
      color: "#FF5722",
    },
    {
      name: "Completed Orders",
      source: items?.completedOrders,
      color: "#4CAF50",
    },
    {
      name: "Pending Orders",
      source: items?.pendingOrders,
      color: "#FFC107",
    },
    {
      name: "Total Books Sold",
      source: items?.totalBooksSold,
      color: "#E91E63",
    },
    {
      name: "Total Orders",
      source: items?.totalOrders,
      color: "#673AB7",
    },
  ];
  return (
    <section className="max-padd-container py-12 px-16 bg-primary h-screen ">
      {isError ? (
        <div>Something get wrong</div>
      ) : isFetching || isLoading ? (
        ""
      ) : (
        <div className="flex flex-wrap gap-4 items-center justify-between px-20 ">
          {boxData.map((item, i) => {
            return (
              <div
                className={`font-bold text-center px-4 py-8 m-4 border-2 sm:w-1/4 bg-[${item.color}] `}
                key={i}
              >
                <div className="text-3xl ">{item.source}</div>
                <div className="text-xl">{item.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
