import PageHeader from '@/components/PageHeader';
import BookDetails from '@/components/BookDetails';

export async function getStaticProps() {
  const res = await fetch('https://openlibrary.org/works/OL453657W.json');
  const data = await res.json();

  return {
    props: { book: data }
  };
}

export default function About(props) {
  return (
    <>
      <PageHeader text="About the Developer – Sandhya Timsina" />
      <p>I am a WEB422 student with a strong interest in building modern and user-friendly web applications. I enjoy learning new technologies and improving my skills in full-stack development, especially working with APIs, databases, and responsive design.
     Through my coursework and projects, I have gained experience in JavaScript, Node.js, and front-end frameworks, and I like applying these skills to create real-world applications. I am always curious to explore new tools and improve the performance and design of my projects.</p>
     
     <p>This page highlights one of my favorite books, combining my interest in reading with my passion for web development.</p>
    
      <BookDetails book={props.book} workId="OL453657W" showFavouriteBtn={false} />
    </>
  );
}
