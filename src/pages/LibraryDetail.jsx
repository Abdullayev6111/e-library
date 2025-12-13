import { useQuery } from '@tanstack/react-query';
import API from '../api/Api';
import {
  Container,
  Skeleton,
  Badge,
  Group,
  Text,
  Title,
  Grid,
  Card,
  Stack,
  Divider,
  Image,
  Center,
  Paper,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import { IconBook, IconMapPin, IconPhone, IconCalendar } from '@tabler/icons-react';
import LibraryImg from '../assets/images/library-img.jpg';
import BookImg from '../assets/images/book-image.jpg';
import { useTranslation } from 'react-i18next';

const LibrariesDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: libraryData, isLoading } = useQuery({
    queryKey: ['library', id],
    queryFn: () => API.get(`/libraries/library/${id}`).then((res) => res.data),
  });

  const library = libraryData?.results?.library;
  const books = libraryData?.results?.books || [];

  if (isLoading) {
    return (
      <Container size="xl" my={100}>
        <Skeleton height={300} radius="lg" />
        <Grid mt="xl" gutter="xl">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Skeleton height={400} radius="lg" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Skeleton height={400} radius="lg" />
          </Grid.Col>
        </Grid>
        <Skeleton height={60} mt="xl" width="60%" radius="md" />
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mt="lg">
          {[...Array(4)]?.map((_, i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  const address = library?.address || 'Manzil mavjud emas';
  const phone = libraryData?.results?.phone || "Telefon raqam yo'q";
  const totalBooks = libraryData?.results?.total_books || 0;

  return (
    <Container size="xl" my={{ base: 80, md: 120 }}>
      <Card withBorder radius="lg" shadow="lg" p={0} style={{ overflow: 'hidden' }}>
        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Image
              src={LibraryImg}
              height={460}
              fit="cover"
              radius="lg"
              m="lg"
              style={{ objectPosition: 'center' }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }} p={{ base: 'xl', md: '3xl' }}>
            <Stack gap="xl">
              <div>
                <Title order={1} size={42} fw={900} c="dark">
                  {library?.name || t('libraryCard.libraryName')}
                </Title>
              </div>

              <Divider />

              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Stack gap={6}>
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                      {t('libraryCard.address')}
                    </Text>
                    <Group gap="xs">
                      <IconMapPin size={18} color="#00aeff" />
                      <Text fw={500} size="md">
                        {address}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Stack gap={6}>
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                      {t('libraryCard.phone')}
                    </Text>
                    <Group gap="xs">
                      <IconPhone size={18} color="#00aeff" />
                      <Text fw={500} size="md">
                        {phone}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Stack gap={6}>
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                      {t('libraryCard.createdAt')}
                    </Text>
                    <Group gap="xs">
                      <IconCalendar size={18} color="#00aeff" />
                      <Text fw={500} size="md">
                        19.09.1999
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Stack gap={6}>
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                      {t('cardDetail.bookQuantity')}:
                    </Text>
                    <Group gap="xs">
                      <IconBook size={18} color="#00aeff" />
                      <Text fw={500} size="md">
                        {totalBooks}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>
              </Grid>

              <Divider />
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Stack mt={100} align="center">
        <Title order={2} size={36} fw={800} ta="center" c="dark">
          {t('libraryCard.availableBooks')} ({books.length} ta)
        </Title>

        {books.length === 0 ? (
          <Paper withBorder radius="lg" p="xl" shadow="md" mt="lg" maw={700} w="100%">
            <Center h={120}>
              <Text size="lg" c="dimmed" fw={500}>
                {t('libraryCard.noAdded')}
              </Text>
            </Center>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl" mt="xl">
            {books?.map((book) => (
              <Card
                key={book.id}
                withBorder
                shadow="sm"
                radius="lg"
                p="lg"
                style={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                className="hover:shadow-xl"
              >
                <Card.Section>
                  <Image src={BookImg} h={200} w={300} radius="lg" style={{ paddingRight: 10 }} />
                </Card.Section>

                <Stack mt="md" gap="md">
                  <Title order={4} size="h4" fw={700} lineClamp={2}>
                    {book.name}
                  </Title>

                  <Divider variant="dashed" />

                  <Group gap={8}>
                    <Text size="sm" c="dimmed">
                      {t('card.author')}:
                    </Text>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {book.author || "Noma'lum"}
                    </Text>
                  </Group>

                  <Group gap={8}>
                    <Text size="sm" c="dimmed">
                      {t('card.publisher')}:
                    </Text>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {book.publisher || "Noma'lum"}
                    </Text>
                  </Group>

                  <Group justify="space-between" mt="lg">
                    <Group gap="xs">
                      <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                        <IconBook size={14} />
                      </ThemeIcon>
                      <Badge color="blue" variant="light" size="lg" radius="md">
                        {book.quantity_in_library} {t('libraryCard.pcs')}
                      </Badge>
                    </Group>
                    <Badge color="green" variant="dot" size="md" radius="md">
                      {t('libraryCard.have')}
                    </Badge>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
};

export default LibrariesDetail;
