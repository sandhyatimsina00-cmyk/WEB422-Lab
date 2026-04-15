/*********************************************************************************
* WEB422 – Assignment 2
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Sandhya Timsina Student ID: 169206232 Date: 03/13/2026
*
********************************************************************************/

import useSWR from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Table, Pagination } from "react-bootstrap";
import PageHeader from "@/components/PageHeader";

export default function Books() {

  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState([]);

  let queryString = { ...router.query };

  let qParts = [];

  Object.entries(queryString).forEach(([key, value]) => {
    qParts.push(`${key}:${value}`);
  });

  if (qParts.length > 0) {
    queryString = qParts.join(" AND ");
  }

  const { data, error } = useSWR(
    `https://openlibrary.org/search.json?q=${queryString}&page=${page}&limit=10`
  );

  useEffect(() => {
    if (data) {
      setPageData(data.docs);
    }
  }, [data]);

  const previous = () => {
    if (page > 1) setPage(page - 1);
  };

  const next = () => {
    setPage(page + 1);
  };

  if (error) {
    return <p>Error loading books</p>;
  }

  return (
    <>
      <PageHeader
        text="Search Results"
        subtext={JSON.stringify(router.query)}
      />

      <Table striped hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>First Published</th>
          </tr>
        </thead>

        <tbody>
          {pageData.map((book) => (
            <tr
              key={book.key}
              onClick={() => router.push(book.key)}
              role="button"
              style={{ cursor: "pointer" }}
            >
              <td>{book.title}</td>
              <td>{book.first_publish_year ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={previous} />
        <Pagination.Item>{page}</Pagination.Item>
        <Pagination.Next onClick={next} />
      </Pagination>
    </>
  );
}

