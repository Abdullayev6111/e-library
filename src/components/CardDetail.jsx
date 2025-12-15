import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import API from '../api/Api';
import { Card, Image, Badge, Group, Stack } from '@mantine/core';
import { Text as MantineText } from '@mantine/core';
import { IconUser, IconBook, IconBooks } from '@tabler/icons-react';
import { useState } from 'react';
import { Pagination, Center } from '@mantine/core';
import CardEl from './CardEl';
import { useTranslation } from 'react-i18next';

const CardDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: bookData, error } = useQuery({
    queryKey: ['bookDetail', id],
    queryFn: () => API.get(`/books/book/${id}/`).then((res) => res.data),
  });

  const { data: allBooks } = useQuery({
    queryKey: ['books'],
    queryFn: () => API.get('/books/books/').then((res) => res.data),
  });

  if (error) {
    console.log(error.message);
  }

  const [page, setPage] = useState(1);
  const booksPerPage = 8;

  const startIndex = (page - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = allBooks ? allBooks.slice(startIndex, endIndex) : [];

  const totalPages = allBooks ? Math.ceil(allBooks.length / booksPerPage) : 0;

  return (
    <div className="container book-deail">
      <div className="book-card-detail">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
          }}
        >
          <Group align="flex-start" gap="md">
            <Image
              w={300}
              h={200}
              radius="md"
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
            />

            <Stack gap="xs" style={{ flex: 1 }}>
              <MantineText size="xl" fw={700} c="dark">
                {bookData?.name}
              </MantineText>

              <Badge color="cyan" variant="light" radius="sm">
                ID: {bookData?.id}
              </Badge>

              <Group gap="sm" align="center">
                <IconUser size={18} color="#666" />
                <MantineText size="sm" c="dimmed">
                  {t('card.author')}: {bookData?.author}
                </MantineText>
              </Group>

              <Group gap="sm" align="center">
                <IconBook size={18} color="#666" />
                <MantineText size="sm" c="dimmed">
                  {t('card.publisher')}: {bookData?.publisher}
                </MantineText>
              </Group>

              <Group gap="sm" align="center">
                <IconBooks size={18} color="#666" />
                <MantineText size="sm" c="dimmed">
                  {t('cardDetail.bookQuantity')}: {bookData?.quantity_in_library}
                </MantineText>
              </Group>
            </Stack>
          </Group>
        </Card>
      </div>
      <div className="all-books">
        <h1 style={{ fontFamily: 'cairo-b', paddingBottom: 10, fontSize: 28, color: 'teal' }}>
          {t('cardDetail.allBooks')}
        </h1>
        <div className="detail-all-books">
          {currentBooks?.map((book) => (
            <CardEl key={book.id} post={book} />
          ))}
        </div>

        {totalPages > 1 && (
          <Center mt={50}>
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              siblings={4}
              boundaries={0}
              withControls
              radius="md"
              size="lg"
              color="cyan"
              styles={{
                control: {
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontWeight: 500,
                  minWidth: 40,
                  height: 40,
                  '&[dataActive]': {
                    backgroundColor: '#22d3ee',
                    color: 'white',
                    borderColor: '#22d3ee',
                    fontWeight: 700,
                  },
                  '&[dataDisabled]': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  },
                },
                dots: {
                  color: '#999',
                },
              }}
            />
          </Center>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
