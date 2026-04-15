/*********************************************************************************
* WEB422 – Assignment 3
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Sandhya Timsina Student ID: 169206232 Date: ________________
*
* Vercel App (Deployed) Link: _____________________________________________________
*
********************************************************************************/

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Form, Button, Container } from "react-bootstrap";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  function submitForm(data) {

    router.push({
      pathname: "/books",
      query: Object.fromEntries(
        Object.entries(data).filter(([k,v]) => v !== "")
      )
    });

  }

  return (
    <Container>

      <PageHeader
        text="Search Books"
        subtext="Find books from OpenLibrary"
      />

      <Form onSubmit={handleSubmit(submitForm)}>

        <Form.Group>
          <Form.Label>Author</Form.Label>

          <Form.Control
            {...register("author", { required: true })}
            className={errors.author ? "is-invalid" : ""}
          />

          {errors.author && (
            <div className="text-danger">
              Author required
            </div>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control {...register("title")} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Subject</Form.Label>
          <Form.Control {...register("subject")} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Language</Form.Label>
          <Form.Control {...register("language")} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Year</Form.Label>
          <Form.Control {...register("first_publish_year")} />
        </Form.Group>

        <Button type="submit" className="mt-3">
          Search
        </Button>

      </Form>

    </Container>
  );
}