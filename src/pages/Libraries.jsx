import { useQuery } from '@tanstack/react-query';
import API from '../api/Api';
import LibraryCard from '../components/LibraryCard';
import { Center, Loader, Text } from '@mantine/core';

const Libraaries = () => {
  const { data: libraries = [], isLoading } = useQuery({
    queryKey: ['libraries'],
    queryFn: () =>
      API.get('/libraries/libraries/').then((res) => {
        console.log('Raw API javobi:', res.data);

        if (Array.isArray(res.data)) {
          return res.data;
        }
        return res.data.results || [];
      }),
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
        <div className="library-left"></div>
        <div className="library-right">
          <div className="library-right-top"></div>
          <div className="library-right-cards">
            {libraries?.map((library) => {
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
        </div>
      </div>
    </div>
  );
};

export default Libraaries;
