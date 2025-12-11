import { useQuery } from '@tanstack/react-query';
import API from '../api/Api';
import LibraryCard from '../components/LibraryCard';
import {
  Center,
  Loader,
  Text,
  Select,
  Checkbox,
  Group,
  Paper,
  Stack,
  Title,
  TextInput,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconSearch, IconGrid3x3, IconList } from '@tabler/icons-react';
import { useState } from 'react';

const Libraaries = () => {
  const { data: libraries = [], isLoading } = useQuery({
    queryKey: ['libraries'],
    queryFn: () =>
      API.get('/libraries/libraries/').then((res) => {
        if (Array.isArray(res.data)) {
          return res.data;
        }
        return res.data.results || [];
      }),
  });

  const [sortBy, setSortBy] = useState('az');
  const [onlyWithBooks, setOnlyWithBooks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLibraries = libraries
    .filter((lib) => {
      const hasBooks = !onlyWithBooks || (lib.total_books ?? 0) > 0;
      const matchesSearch =
        !searchQuery.trim() || lib.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return hasBooks && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      if (sortBy === 'booksDesc') return (b.total_books || 0) - (a.total_books || 0);
      if (sortBy === 'booksAsc') return (a.total_books || 0) - (b.total_books || 0);
      return 0;
    });
  const libraryIds = libraries.map((lib) => lib.id);

  const { data: detailsMap = {} } = useQuery({
    queryKey: ['librariesDetails', libraryIds],
    queryFn: async () => {
      const results = await Promise.all(
        libraryIds.map((id) =>
          API.get(`/libraries/library/${id}/`)
            .then((r) => ({ id, ...r.data }))
            .catch(() => ({ id, phone: null, social_media: { telegram: null } }))
        )
      );

      return Object.fromEntries(results.map((item) => [item.id, item]));
    },
    enabled: libraryIds.length > 0,
  });

  if (isLoading) {
    return (
      <Center my={100}>
        <Loader size="lg" color="teal" />
        <Text ml={10}>Kutubxonalar yuklanmoqda...</Text>
      </Center>
    );
  }

  if (!libraries.length) {
    return (
      <Center my={100}>
        <Text c="dimmed">Kutubxona topilmadi</Text>
      </Center>
    );
  }

  return (
    <div className="container">
      <h1 className="lib-title">Kutubxonalar ro'yxati</h1>
      <div className="library">
        <div className="library-left" style={{ width: '320px', flexShrink: 0 }}>
          <Paper shadow="md" radius="lg" p="xl" withBorder>
            <Stack gap="lg">
              <Title order={4} ta="center" mb="md">
                Filtrlar
              </Title>

              <Select
                label="Nomi (A-Z)"
                placeholder="Saralash usuli"
                value={sortBy}
                onChange={(value) => setSortBy(value || 'az')}
                data={[
                  { value: 'az', label: 'Nomi (A→Z)' },
                  { value: 'za', label: 'Nomi (Z→A)' },
                  { value: 'booksDesc', label: "Kitoblar soni (kamdan ko'p)" },
                  { value: 'booksAsc', label: "Kitoblar soni (ko'pdan kam)" },
                ]}
                leftSection={<i className="fa-solid fa-filter" style={{ color: '#228be6' }} />}
                styles={{ input: { fontWeight: 500 } }}
              />

              <Checkbox
                label="Faqat kitoblari mavjudlar"
                checked={onlyWithBooks}
                onChange={(e) => setOnlyWithBooks(e.currentTarget.checked)}
                color="teal"
                size="md"
              />
            </Stack>
          </Paper>
        </div>
        <div className="library-right">
          <div className="library-right-top" style={{ marginBottom: '32px' }}>
            <Group justify="space-between" align="center">
              <TextInput
                placeholder="Qidirish (nomi bo'yicha)..."
                leftSection={<IconSearch size={18} color="#666" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                size="md"
                radius="xl"
                style={{ width: '420px', maxWidth: '100%' }}
                styles={{
                  input: {
                    fontSize: '15px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    '&:focus': { borderColor: '#228be6' },
                  },
                }}
              />

              <Group gap="xs">
                <Tooltip label="Grid ko'rinish" position="bottom">
                  <ActionIcon size="lg" radius="md" variant="light" color="gray" disabled>
                    <IconGrid3x3 size={20} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Ro'yxat ko'rinish" position="bottom">
                  <ActionIcon size="lg" radius="md" variant="light" color="gray" disabled>
                    <IconList size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </div>

          {filteredLibraries.length === 0 ? (
            <Center h={300}>
              <Text c="dimmed" size="xl">
                Hech narsa topilmadi
              </Text>
            </Center>
          ) : (
            <div
              className="library-right-cards"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
              }}
            >
              {filteredLibraries.map((library) => {
                const detail = detailsMap[library.id];
                return (
                  <LibraryCard
                    key={library.id}
                    library={library}
                    phone={detail?.phone}
                    telegram={detail?.social_media?.telegram}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Libraaries;
