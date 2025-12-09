import { Badge, Card, Image, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import LibraryImg from '../assets/images/library-img.jpg';

const LibraryCard = ({ library, phone, telegram }) => {
  const navigate = useNavigate();

  return (
    <Card
      shadow="md"
      radius="lg"
      padding="lg"
      withBorder
      style={{
        width: true,
        cursor: 'pointer',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onClick={() => navigate(`/libraryDetail/${library.id}`)}
    >
      <Card.Section>
        <Image src={LibraryImg} height={200} fit="cover" alt={library.name} />
        <Badge color="green" style={{ position: 'absolute', top: 10, right: 10 }}>
          Faol
        </Badge>
      </Card.Section>

      <div>
        <Text fw={700} size="xl" lineClamp={2} style={{ fontFamily: 'cairo-b' }}>
          {library.name}
        </Text>

        <Text size="sm" c="dimmed" mt={8}>
          <i className="fa-solid fa-book"></i> {library.total_books || 0}
        </Text>

        <Text size="sm" c="dimmed" mt={4}>
          <i className="fa-solid fa-phone"></i> {phone || '—'}
        </Text>

        <Text size="sm" c="dimmed" mt={4}>
          <i className="fa-brands fa-telegram"></i>{' '}
          {telegram ? (
            <a
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0088cc', textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              {telegram.replace('https://t.me/', '@')}
            </a>
          ) : (
            '—'
          )}
        </Text>

        <Text size="sm" c="dimmed" mt={4} lineClamp={1}>
          <i className="fa-solid fa-location-dot"></i> {library.address || 'Manzil ko‘rsatilmagan'}
        </Text>
      </div>
    </Card>
  );
};

export default LibraryCard;
