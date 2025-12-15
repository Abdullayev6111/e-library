import { useState, useMemo } from 'react';
import {
  Avatar,
  Group,
  Paper,
  Stack,
  Button,
  Modal,
  ActionIcon,
  Menu,
  Loader,
  Center,
  TextInput,
  Switch,
  Tabs,
  Card,
  Box,
} from '@mantine/core';
import { Text as MantineText } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconSettings,
  IconEdit,
  IconLogout,
  IconCheck,
  IconX,
  IconMapPin,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTelegram,
  IconBook,
  IconShare,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  ZoomControl,
  TypeSelector,
} from '@pbe/react-yandex-maps';
import API from '../api/Api';
import useAuthStore from '../store/useAuthStore';
import BookReader from '../assets/images/book-reader.jpg';

/**
 * @param {{id: number, title: string, author: string}[]} books - Kitoblar massivi.
 */
function BooksSection({ books }) {
  if (!books || books.length === 0) {
    return <MantineText c="dimmed">Kitoblar ro'yxati mavjud emas.</MantineText>;
  }

  return (
    <Stack>
      {books?.map((b) => (
        <Card key={b.id} withBorder radius="md">
          <MantineText fw={600}>{b.title}</MantineText>
          <MantineText size="sm" c="dimmed">
            {b.author}
          </MantineText>
        </Card>
      ))}
    </Stack>
  );
}

/**
 * @param {{telegram: string, instagram: string, facebook: string}} social - Ijtimoiy tarmoq havolalari.
 */
function SocialSection({ social }) {
  if (!social || (!social.telegram && !social.instagram && !social.facebook)) {
    return <MantineText c="dimmed">Ijtimoiy tarmoqlar kiritilmagan.</MantineText>;
  }

  return (
    <Stack>
      {social?.telegram && (
        <Button
          component="a"
          href={social.telegram}
          target="_blank"
          leftSection={<IconBrandTelegram />}
          variant="light"
          color="blue"
        >
          Telegram
        </Button>
      )}
      {social?.instagram && (
        <Button
          component="a"
          href={social.instagram}
          target="_blank"
          leftSection={<IconBrandInstagram />}
          variant="light"
          color="pink"
        >
          Instagram
        </Button>
      )}
      {social?.facebook && (
        <Button
          component="a"
          href={social.facebook}
          target="_blank"
          leftSection={<IconBrandFacebook />}
          variant="light"
          color="indigo"
        >
          Facebook
        </Button>
      )}
    </Stack>
  );
}

/**
 * @param {string} address - Manzil matni.
 * @param {[number, number]} coords - Manzil koordinatalari [latitude, longitude].
 */
function MapSection({ address, coords }) {
  const location = coords;

  if (!location || location.length !== 2 || typeof location[0] !== 'number') {
    return (
      <MantineText c="dimmed">Xarita mavjud emas (manzil koordinatalari kiritilmagan).</MantineText>
    );
  }

  const API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

  return (
    <Stack>
      <MantineText size="md" fw={500}>
        Manzil: **{address || 'Kiritilmagan'}**
      </MantineText>

      <Box
        mt="lg"
        style={{
          width: '100%',
          height: 450,
          border: '2px solid #e0e0e0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <YMaps query={API_KEY ? { apikey: API_KEY } : {}}>
          <Map
            width="100%"
            height="100%"
            defaultState={{
              center: location,
              zoom: 16,
            }}
          >
            <Placemark
              geometry={location}
              properties={{
                hintContent: 'Foydalanuvchi joylashuvi',
                balloonContent: address || 'Kiritilgan manzil',
              }}
              options={{
                draggable: false,
                preset: 'islands#blueDotIcon',
              }}
            />

            <FullscreenControl />
            <ZoomControl options={{ float: 'right' }} />
            <TypeSelector options={{ float: 'right' }} />
          </Map>
        </YMaps>
      </Box>
    </Stack>
  );
}

export default function Profile() {
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [logoutModalOpened, setLogoutModalOpened] = useState(false);
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => API.get('/auth/profile/').then((res) => res.data),
  });

  const coordinates = useMemo(() => {
    if (user && user.latitude && user.longitude) {
      const lat = parseFloat(user.latitude);
      const lon = parseFloat(user.longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        return [lat, lon];
      }
    }
    return null;
  }, [user]);

  const form = useForm({
    initialValues: {
      address: '',
      can_rent_books: true,
      instagram: '',
      facebook: '',
      telegram: '',
    },
  });

  if (user && form.values.address === '' && user.address !== undefined) {
    form.setValues({
      address: user.address || '',
      can_rent_books: user.can_rent_books ?? true,
      instagram: user.social_media?.instagram || '',
      facebook: user.social_media?.facebook || '',
      telegram: user.social_media?.telegram || '',
    });
  }

  const updateMutation = useMutation({
    mutationFn: (values) =>
      API.patch('/auth/profile/', {
        address: values.address,
        can_rent_books: values.can_rent_books,
        social_media: {
          instagram: values.instagram || null,
          facebook: values.facebook || null,
          telegram: values.telegram || null,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditModalOpened(false);
      notifications.show({
        title: 'Muvaffaqiyatli',
        message: 'Profil yangilandi',
        color: 'teal',
        icon: <IconCheck />,
      });
    },
    onError: () => {
      notifications.show({
        title: 'Xatolik',
        message: 'Yangilab bo‘lmadi',
        color: 'red',
        icon: <IconX />,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => API.post('/auth/logout/'),
    onSuccess: () => {
      logoutStore();
      navigate('/login', { replace: true });
    },
    onError: () => {
      logoutStore();
      navigate('/login', { replace: true });
    },
  });

  if (isLoading) {
    return (
      <Center h="80vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (!user || !user.user) {
    return (
      <Center h="80vh">
        <MantineText>Profil ma'lumotlari yuklanmadi.</MantineText>
      </Center>
    );
  }

  const rentStatus = user.can_rent_books ? 'Kitob ijarasi mavjud' : 'Kitob ijarasi mavjud emas';
  const mockBooks = user.books || [];

  return (
    <>
      <Paper shadow="sm" p="lg" m="xl" radius="md" withBorder>
        <Group justify="space-between">
          <Group>
            <Avatar size={120} radius={120} src={BookReader} />
            <Stack gap={4}>
              <MantineText size="xl" fw={700}>
                {user.user.name}
              </MantineText>
              <MantineText c="blue">+{user.user.phone}</MantineText>
              <Group gap="xs">
                <IconMapPin size={16} />
                <MantineText size="sm" c="dimmed">
                  {user.address || 'Manzil kiritilmagan'}
                </MantineText>
              </Group>
              <Group gap="xs">
                <IconBook size={16} />
                <MantineText size="sm" c={user.can_rent_books ? 'teal' : 'red'}>
                  {rentStatus}
                </MantineText>
              </Group>
            </Stack>
          </Group>

          <Menu>
            <Menu.Target>
              <ActionIcon size="lg" variant="filled">
                <IconSettings />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit />} onClick={() => setEditModalOpened(true)}>
                Tahrirlash
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout />}
                onClick={() => setLogoutModalOpened(true)}
              >
                Chiqish
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>

      <Paper shadow="sm" p="lg" m="xl" radius="md" withBorder>
        <Tabs defaultValue="books">
          <Tabs.List>
            <Tabs.Tab value="books" leftSection={<IconBook size={16} />}>
              Kitoblarim
            </Tabs.Tab>
            <Tabs.Tab value="social" leftSection={<IconShare size={16} />}>
              Tarmoqlarim
            </Tabs.Tab>
            <Tabs.Tab value="map" leftSection={<IconMapPin size={16} />}>
              Xarita
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="books" pt="md">
            <BooksSection books={mockBooks} />
          </Tabs.Panel>

          <Tabs.Panel value="social" pt="md">
            <SocialSection social={user.social_media} />
          </Tabs.Panel>

          <Tabs.Panel value="map" pt="md">
            <MapSection address={user.address} coords={coordinates} />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Profilni tahrirlash"
        centered
      >
        <form onSubmit={form.onSubmit((v) => updateMutation.mutate(v))}>
          <Stack>
            <TextInput
              label="Manzil (joy nomi)"
              leftSection={<IconMapPin />}
              placeholder="Masalan: Chilonzor"
              {...form.getInputProps('address')}
            />
            <Switch
              label="Kitoblarni ijaraga bera olaman"
              {...form.getInputProps('can_rent_books', { type: 'checkbox' })}
            />

            <MantineText fw={600} size="sm" mt="sm">
              Ijtimoiy tarmoq havolalari
            </MantineText>
            <TextInput
              placeholder="https://t.me/username"
              leftSection={<IconBrandTelegram />}
              {...form.getInputProps('telegram')}
            />
            <TextInput
              placeholder="https://instagram.com/username"
              leftSection={<IconBrandInstagram />}
              {...form.getInputProps('instagram')}
            />
            <TextInput
              placeholder="https://facebook.com/username"
              leftSection={<IconBrandFacebook />}
              {...form.getInputProps('facebook')}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={updateMutation.isPending}>
                Saqlash
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={logoutModalOpened}
        onClose={() => setLogoutModalOpened(false)}
        title="Tizimdan chiqish"
        centered
      >
        <MantineText>Tizimdan chiqishni tasdiqlaysizmi?</MantineText>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setLogoutModalOpened(false)}>
            Yo‘q
          </Button>
          <Button
            color="red"
            loading={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            Ha
          </Button>
        </Group>
      </Modal>
    </>
  );
}
