import useSWR from "swr";
import { Card } from "react-bootstrap";
import Link from "next/link";

export default function BookCard({ workId }) {
  const { data, error, isLoading } = useSWR(
    `https://openlibrary.org/works/${workId}.json`
  );

  if (isLoading) {
    return (
      <Card className="h-100">
        <Card.Body>Loading…</Card.Body>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="h-100 border-danger">
        <Card.Body>Unable to load this book.</Card.Body>
      </Card>
    );
  }

  const coverId = data.covers?.[0];
  const imgSrc = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://placehold.co/200x300?text=No+Cover";

  return (
    <Card className="h-100">
      <Link href={`/works/${workId}`} className="text-decoration-none text-dark">
        <Card.Img
          variant="top"
          src={imgSrc}
          alt=""
          style={{ objectFit: "cover", maxHeight: 280 }}
          onError={(e) => {
            e.target.src = "https://placehold.co/200x300?text=No+Cover";
          }}
        />
        <Card.Body>
          <Card.Title className="h6">{data.title}</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  );
}
