/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Card from "./Card.jsx";
function BooksPagination({ books, currentPage, setCurrentPage }) {
  const [currentBooks, setCurrentBooks] = useState();
  const booksPerPage = 10;

  const lastBookIndex = booksPerPage * currentPage;
  const firstBookIndex = lastBookIndex - booksPerPage;

  useEffect(() => {
    setCurrentBooks(() => {
      return books?.slice(firstBookIndex, lastBookIndex);
    });
  }, [currentPage]);
  return (
    <div className="py-4 ">
      <div className="flexBetween  flex-wrap gap-2">
        {currentBooks?.map((book) => {
          return <Card key={book._id} book={book} style=" md:w-1/4 xl:w-1/6" />;
        })}
      </div>
      <div className="flexCenter gap-4 py-4">
        <button
          className="btn-secondary !py-1 !px-3 "
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          Previous
        </button>
        {books && books.length > 0
          ? [...Array(Math.ceil(books.length / booksPerPage))].map((_, i) => (
              <button
                className={`btn-light !py-1 !px-3 ${
                  currentPage == i + 1 ? "!bg-secondaryOne" : ""
                }`}
                key={i}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))
          : ""}
        <button
          className="btn-secondary !py-1 !px-3"
          onClick={() => {
            if (currentPage <= Math.ceil(books.length / booksPerPage) - 1) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BooksPagination;
