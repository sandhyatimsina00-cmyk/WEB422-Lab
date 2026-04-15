import { Container, Row, Col, Button } from "react-bootstrap";
import { useAtom } from "jotai";
import { favouritesAtom } from "../store";
import { useEffect, useState } from "react";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function BookDetails({
  book,
  workId,
  showFavouriteBtn = true,
}) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(workId));
  }, [favouritesList, workId]);

  async function favouritesClicked() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(workId));
    } else {
      setFavouritesList(await addToFavourites(workId));
    }
  }

  return (
    <Container>
      <Row>
        <Col lg="4">
          <img
            className="img-fluid w-100"
            src={`https://covers.openlibrary.org/b/id/${book?.covers?.[0]}-L.jpg`}
            alt="Cover"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x600?text=Cover+Not+Available";
            }}
          />
        </Col>

        <Col lg="8">
          <h3>{book.title}</h3>

          {book.description && (
            <p>
              {typeof book.description === "string"
                ? book.description
                : book.description.value}
            </p>
          )}

          {book.subject_people && (
            <>
              <h5>Characters</h5>
              {book.subject_people.join(", ")}
            </>
          )}

          {book.subject_places && (
            <>
              <h5>Settings</h5>
              {book.subject_places.join(", ")}
            </>
          )}

          {book.links && (
            <>
              <h5>More Information</h5>

              {book.links.map((link, i) => (
                <div key={i}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.title}
                  </a>
                </div>
              ))}
            </>
          )}

          {showFavouriteBtn && workId && (
            <Button
              variant={showAdded ? "primary" : "outline-primary"}
              onClick={favouritesClicked}
              className="mt-3"
            >
              {showAdded ? "+ Favourite (added)" : "+ Favourite"}
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}
