import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Switch,
  Paper,
  Stack,
  Title,
  Text,
  Anchor,
  Group,
  Box,
} from '@mantine/core';
import {
  IconUser,
  IconPhone,
  IconLock,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTelegram,
  IconMapPin,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import API from '../api/Api';
import { IMaskInput } from 'react-imask';
import {
  Map,
  YMaps,
  Placemark,
  FullscreenControl,
  ZoomControl,
  TypeSelector,
} from '@pbe/react-yandex-maps';

const RegisterPage = () => {
  const [hasLibrary, setHasLibrary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      password: '',
      address: '',
      instagram: '',
      facebook: '',
      telegram: '',
    },

    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Ism kamida 2 harfdan iborat bo'lishi kerak" : null,

      phone: (value) =>
        !/^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/.test(value)
          ? "To'g'ri telefon raqam kiriting"
          : null,

      password: (value) =>
        value.length < 6
          ? "Parol kamida 6 belgi bo'lishi kerak"
          : value.length > 128
          ? 'Parol juda uzun'
          : null,

      address: (value) =>
        value.trim().length < 5 ? "Manzil kamida 5 belgidan iborat bo'lishi kerak" : null,

      instagram: (value) =>
        value && !/^@?[\w.]{1,30}$/.test(value.replace('@', ''))
          ? "Noto'g'ri Instagram username"
          : null,

      facebook: (value) =>
        value && !/^[\w.]{5,}$/.test(value.replace('facebook.com/', ''))
          ? "Noto'g'ri Facebook username"
          : null,

      telegram: (value) =>
        value && !/^@?[\w]{5,}$/.test(value.replace('@', ''))
          ? "Noto'g'ri Telegram username"
          : null,
    },
  });

  const isFormValid =
    form.isValid() &&
    form.values.phone.match(/^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/) &&
    location !== null;

  const handleSubmit = async (values) => {
    if (!location) {
      notifications.show({
        title: 'Diqqat',
        message: 'Xaritadan kutubxona joylashuvini belgilang',
        color: 'red',
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      user: {
        name: values.name.trim(),
        phone: values.phone.replace(/[+\s-()]/g, ''),
        password: values.password,
      },
      library: {
        address: values.address.trim(),
        social_media: {
          instagram: values.instagram ? values.instagram.replace('@', '') : null,
          facebook: values.facebook ? values.facebook.split('/').pop() : null,
          telegram: values.telegram ? values.telegram.replace('@', '') : null,
        },
        can_rent_books: hasLibrary,
        latitude: location[0],
        longitude: location[1],
      },
    };

    try {
      await API.post('/auth/register-library/', payload);
      notifications.show({
        title: 'Tabriklaymiz!',
        message: "Kutubxonachi sifatida muvaffaqiyatli ro'yxatdan o'tdingiz",
        color: 'green',
      });
      navigate('/login');
    } catch (err) {
      notifications.show({
        title: err.message || 'Xato',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAddressFromCords = async (event) => {
    const coords = event.get('coords');
    setLocation(coords);

    try {
      const [lat, lng] = coords;
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=3e206efe-ea7d-442a-88e5-f77e57cc0d2e&geocode=${lng},${lat}&format=json&kind=house&lang=uz_UZ`
      );
      const data = await response.json();

      const fullAddress =
        data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.metaDataProperty
          ?.GeocoderMetaData?.text;

      const finalAddress = fullAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(finalAddress);
      form.setFieldValue('address', finalAddress);
    } catch (err) {
      console.error('Manzil olishda xato:', err);
      setAddress(`${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`);
      form.setFieldValue('address', coords[0].toFixed(6) + ', ' + coords[1].toFixed(6));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 40,
      }}
    >
      <Paper withBorder shadow="lg" p={50} radius="lg" style={{ width: 1000 }}>
        <Stack align="center" mb={30}>
          <Title order={2} c="blue">
            Kutubxonachi ro'yxatdan o'tish
          </Title>
          <Text size="sm" c="dimmed">
            Kutubxona ma'lumotlarini to'ldiring
          </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={20}>
            <Group grow>
              <TextInput
                required
                label="Ism"
                placeholder="Ismingiz"
                leftSection={<IconUser size={18} color="#00aeff" />}
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Instagram"
                placeholder="@username"
                leftSection={<IconBrandInstagram size={18} color="#E4405F" />}
                {...form.getInputProps('instagram')}
              />
            </Group>

            <Group grow>
              <TextInput
                required
                component={IMaskInput}
                mask="+998 (00) 000-00-00"
                placeholder="+998 (00) 000-00-00"
                leftSection={<IconPhone size={18} color="#00aeff" />}
                {...form.getInputProps('phone')}
              />
              <TextInput
                label="Facebook"
                placeholder="username yoki link"
                leftSection={<IconBrandFacebook size={18} color="#1877F2" />}
                {...form.getInputProps('facebook')}
              />
            </Group>

            <Group grow align="flex-end">
              <PasswordInput
                required
                label="Parol"
                placeholder="Kamida 6 belgi"
                leftSection={<IconLock size={18} color="#00aeff" />}
                style={{ flex: 1 }}
                {...form.getInputProps('password')}
              />
              <TextInput
                label="Telegram"
                placeholder="@username"
                leftSection={<IconBrandTelegram size={18} color="#229ED9" />}
                style={{ flex: 1 }}
                {...form.getInputProps('telegram')}
              />
            </Group>

            <TextInput
              required
              label="Manzil (ko'cha, uy)"
              placeholder={address ? address : 'Manzilni tanlang'}
              leftSection={<IconMapPin size={18} color="#00aeff" />}
              {...form.getInputProps('address')}
            />

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
              <YMaps query={{ apikey: '3e206efe-ea7d-442a-88e5-f77e57cc0d2e' }}>
                <Map
                  width="100%"
                  height="100%"
                  defaultState={{
                    center: location || [41.311081, 69.240562],
                    zoom: location ? 16 : 11,
                  }}
                  onClick={getAddressFromCords}
                >
                  {location && (
                    <Placemark
                      geometry={location}
                      properties={{
                        hintContent: 'Kutubxona joylashuvi',
                        balloonContent: address || 'Joylashuv tanlandi',
                      }}
                      options={{
                        preset: 'islands#redDotIcon',
                        draggable: true,
                      }}
                      onDragEnd={(e) => {
                        const newCoords = e.get('target').geometry.getCoordinates();
                        getAddressFromCords({ get: () => newCoords });
                      }}
                    />
                  )}
                  <FullscreenControl />
                  <ZoomControl options={{ float: 'right' }} />
                  <TypeSelector options={{ float: 'right' }} />
                </Map>
              </YMaps>
            </Box>

            <Switch
              checked={hasLibrary}
              onChange={(e) => setHasLibrary(e.currentTarget.checked)}
              label="Kitob ijarasi mavjud"
              color="blue"
              size="lg"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              color="blue"
              radius="md"
              loading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              Ro'yxatdan o'tish
            </Button>

            <Text ta="center">
              Hisobingiz bormi?{' '}
              <Anchor component={Link} to="/login" fw={700}>
                Tizimga kirish
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default RegisterPage;
