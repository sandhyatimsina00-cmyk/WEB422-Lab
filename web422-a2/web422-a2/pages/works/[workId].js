import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import PageHeader from '@/components/PageHeader';
import BookDetails from '@/components/BookDetails';

export default function Work() {
  const router = useRouter();
  const { workId } = router.query;

  const { data, error, isLoading } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null
  );

  // While loading, render nothing
  if (isLoading) return null;

  // If error or no data, show 404
  if (error || !data) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <PageHeader text={data.title} />
      <BookDetails book={data} workId={workId} />
    </>
  );
}
