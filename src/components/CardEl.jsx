import { Badge, Card, Image, Text, Group, ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import BookImg from '../assets/images/book-image.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/useAuthStore';

const CardEl = ({ post, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth } = useAuthStore();

  const isBookPage = location.pathname === '/books';
  const showActions = isAuth && isBookPage;

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
        width: '100%',
        maxWidth: '330px',
        height: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      className="book-card"
    >
      <Card.Section style={{ position: 'relative' }}>
        <Image
          src={BookImg}
          onClick={() => handleNavigate(post.id)}
          height={180}
          fit="cover"
          alt={post.name}
          style={{ cursor: 'pointer' }}
          className="book-card-img"
        />
        <Badge style={{ position: 'absolute', top: 10, right: 10 }} color="orange">
          {t('card.readed')}
        </Badge>

        {showActions && (
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                variant="filled"
                color="gray"
                size="lg"
                radius="xl"
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                }}
              >
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={() => onEdit && onEdit(post)}
              >
                Tahrirlash
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => onDelete && onDelete(post)}
              >
                O'chirish
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Card.Section>

      <div>
        <Text fw={700} size="xl" lineClamp={2} style={{ fontFamily: 'cairo-b' }}>
          {post.name}
        </Text>

        <Text size="sm" c="dimmed" mt={8} style={{ fontFamily: 'cairo-m' }}>
          {t('card.author')}: {post.author}
        </Text>

        <Text size="sm" c="dimmed" mt={4} style={{ fontFamily: 'cairo-m' }}>
          {t('card.publisher')}: {post.publisher}
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
        {post.quantity_in_library} {t('card.bookQuantity')}
      </Badge>
    </Card>
  );
};

export default CardEl;
