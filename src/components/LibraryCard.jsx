import { Badge, Card, Image } from '@mantine/core';
import { Text as MantineText } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import LibraryImg from '../assets/images/library-img.jpg';
import { useTranslation } from 'react-i18next';

const LibraryCard = ({ library, phone, telegram }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          {t('libraryCard.active')}
        </Badge>
      </Card.Section>

      <div>
        <MantineText fw={700} size="xl" lineClamp={2} style={{ fontFamily: 'cairo-b' }}>
          {library.name}
        </MantineText>

        <MantineText size="sm" c="dimmed" mt={8}>
          <i className="fa-solid fa-book"></i> {library.total_books || 0}
        </MantineText>

        <MantineText size="sm" c="dimmed" mt={4}>
          <i className="fa-solid fa-phone"></i> {phone || '—'}
        </MantineText>

        <MantineText size="sm" c="dimmed" mt={4}>
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
        </MantineText>

        <MantineText size="sm" c="dimmed" mt={4} lineClamp={1}>
          <i className="fa-solid fa-location-dot"></i> {library.address || "Manzil ko'rsatilmagan"}
        </MantineText>
      </div>
    </Card>
  );
};

export default LibraryCard;
