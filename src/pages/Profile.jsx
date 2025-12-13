import { useState } from 'react';
import {
  Avatar,
  Text,
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
} from '@mantine/core';
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
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import API from '../api/Api';
import useAuthStore from '../store/useAuthStore';
import BookReader from '../assets/images/book-reader.jpg';

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

  const form = useForm({
    initialValues: {
      address: '',
      can_rent_books: true,
      instagram: '',
      facebook: '',
      telegram: '',
    },
  });

  if (user && form.values.address === '' && user.address) {
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
        message: 'Maʼlumotlarni yangilab boʻlmadi',
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
      notifications.show({
        title: 'Ogohlantirish',
        message: 'Serverda xatolik, tizimdan chiqildi',
        color: 'yellow',
      });
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

  return (
    <>
      <Paper shadow="sm" p="lg" m={'xl'} radius="md" withBorder>
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar size={120} radius={120}>
              <img
                src={BookReader}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
            <Stack gap={6}>
              <Text size="xl" fw={700}>
                {user?.name}
              </Text>
              <Text size="lg" c="blue">
                {user?.phone}
              </Text>
              {(user?.address || user?.address === '') && (
                <Text size="sm" c="dimmed">
                  {user.address || 'Manzil kiritilmagan'}
                </Text>
              )}
              <Text size="sm" c="dimmed">
                Chilonzor
              </Text>
            </Stack>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon size="lg" variant="filled" color="blue">
                <IconSettings size={22} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={() => setEditModalOpened(true)}
              >
                Tahrirlash
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLogout size={16} />}
                color="red"
                onClick={() => setLogoutModalOpened(true)}
              >
                Chiqish
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>

      <Paper shadow="sm" p="lg" m="xl" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Kitoblarim
        </Text>
        <Text c="dimmed">Kitob topilmadi</Text>
      </Paper>

      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Profilni tahrirlash"
        size="md"
        centered
      >
        <form onSubmit={form.onSubmit((values) => updateMutation.mutate(values))}>
          <Stack gap="md">
            <TextInput
              label="Manzil"
              placeholder="Chilonzor"
              leftSection={<IconMapPin size={18} />}
              required
              {...form.getInputProps('address')}
            />

            <Switch
              label="Kitob ijarasi"
              description="Kitob ijarasi mavjud emas"
              onLabel="Mavjud"
              offLabel="Yoʻq"
              size="lg"
              {...form.getInputProps('can_rent_books', { type: 'checkbox' })}
            />

            <Text fw={500} size="sm" mt="lg">
              Ijtimoiy tarmoqlar
            </Text>

            <TextInput
              placeholder="Instagram"
              leftSection={<IconBrandInstagram size={20} style={{ color: '#E4405F' }} />}
              {...form.getInputProps('instagram')}
            />
            <TextInput
              placeholder="Facebook"
              leftSection={<IconBrandFacebook size={20} style={{ color: '#1877F2' }} />}
              {...form.getInputProps('facebook')}
            />
            <TextInput
              placeholder="https://t.me/username"
              leftSection={<IconBrandTelegram size={20} style={{ color: '#0088CC' }} />}
              {...form.getInputProps('telegram')}
            />

            <Group justify="apart" mt="xl">
              <Button variant="default" onClick={() => setEditModalOpened(false)}>
                Bekor qilish
              </Button>
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
        title="Chiqish"
        centered
        size="sm"
      >
        <Text>Haqiqatan ham chiqmoqchimisiz?</Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setLogoutModalOpened(false)}>
            Yoʻq
          </Button>
          <Button
            color="red"
            onClick={() => logoutMutation.mutate()}
            loading={logoutMutation.isPending}
          >
            Ha, chiqish
          </Button>
        </Group>
      </Modal>
    </>
  );
}
