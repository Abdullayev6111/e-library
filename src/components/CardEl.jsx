import { Badge, Card, Image, Text } from '@mantine/core';
import BookImg from '../assets/images/book-image.jpg';
import { useNavigate } from 'react-router-dom';

const CardEl = ({ post }) => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/bookDetail/${id}`);
  };
  return (
    <Card
      shadow="md"
      radius="lg"
      padding="lg"
      withBorder
      style={{
        width: '330px',
        height: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}
      className="book-card"
    >
      <Card.Section>
        <Image
          src={BookImg}
          onClick={() => handleNavigate(post.id)}
          height={180}
          fit="cover"
          alt={post.name}
          className="book-card-img"
        />
        <Badge style={{ position: 'absolute', top: 10, right: 10 }} color="orange">
          O'qilgan
        </Badge>
      </Card.Section>

      <div>
        <Text fw={700} size="xl" lineClamp={2} style={{ fontFamily: 'cairo-b' }}>
          {post.name}
        </Text>

        <Text size="sm" c="dimmed" mt={8} style={{ fontFamily: 'cairo-m' }}>
          Muallif: {post.author}
        </Text>

        <Text size="sm" c="dimmed" mt={4} style={{ fontFamily: 'cairo-m' }}>
          Nashriyot: {post.publisher}
        </Text>
      </div>

      <Badge
        color="blue"
        variant="outline"
        size="xl"
        radius="xl"
        style={{
          alignSelf: 'flex-start',
          padding: '0 18px',
          fontFamily: 'cairo-b',
        }}
      >
        {post.quantity_in_library} TA KITOB MAVJUD
      </Badge>
    </Card>
  );
};

export default CardEl;
