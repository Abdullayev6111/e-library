import { Button, Flex, Input, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IMaskInput } from 'react-imask';
import { Link, useNavigate } from 'react-router-dom';
import LoginImg from '../assets/images/login-img.svg';
import useAuthStore from '../store/useAuthStore';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import API from './../api/Api';

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      phone: '',
      password: '',
    },
    validate: {
      phone: (value) => (!value ? 'Telefon raqamni kiriting' : null),
      password: (value) => (!value ? 'Parol kiriting' : null),
    },
  });

  const { mutate: loginMut, isPending } = useMutation({
    mutationFn: async (body) => {
      const res = await API.post('/auth/login/', body);
      return res.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.access);
      useAuthStore.getState().setUser(data.user);

      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: `Xush kelibsiz!`,
        color: 'green',
      });

      navigate('/', { replace: true });
    },
    onError: (err) => {
      notifications.show({
        title: 'Xato',
        message: err.response?.data?.message || "Raqam yoki parol noto'g'ri",
        color: 'red',
      });
    },
  });

  const handleSubmit = (values) => {
    loginMut({
      phone: values.phone.replace(/[+\s()-]/g, ''),
      password: String(values.password),
    });
  };

  return (
    <div className="login">
      <div className="login-left">
        <img src={LoginImg} alt="" />
      </div>
      <div className="login-page">
        <Link to="/">
          <Button
            variant="subtitle"
            style={{
              background: 'transparent',
              color: '#010101',
              fontSize: 18,
              fontFamily: 'cairo-m',
              marginLeft: -20,
            }}
          >
            <i className="fa-solid fa-arrow-left-long" style={{ marginRight: 10 }}></i> Orqaga
          </Button>
        </Link>
        <div style={{ marginTop: 50 }}>
          <h1 className="login-title">Tizimga Kirish</h1>
          <p>Platformadan foydalanish uchun tizimga kiring</p>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Input.Wrapper
              style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}
              label="Telefon raqam"
              withAsterisk
            >
              <Input
                required
                component={IMaskInput}
                mask="+998 (00) 000-00-00"
                placeholder="+998 (00) 000-00-00"
                {...form.getInputProps('phone')}
                onAccept={(value) => {
                  const cleaned = value.replace(/[+\s()-]/g, '');
                  form.setFieldValue('phone', cleaned || value);
                }}
              />
            </Input.Wrapper>
            <PasswordInput
              label="Parol"
              placeholder="••••••••"
              size="lg"
              required
              {...form.getInputProps('password')}
            />
            <Button
              type="submit"
              fullWidth
              size="lg"
              radius="md"
              loading={isPending}
              style={{
                background: 'linear-gradient(90deg, #00aeff, #4096ff)',
                height: 56,
                fontSize: 18,
                fontWeight: 600,
                fontFamily: 'cairo-sb',
                marginTop: 30,
              }}
            >
              {isPending ? 'Tizimga kirish' : 'Tizimga kirish'}
            </Button>
          </form>
          <Flex gap={10} align="center" style={{ marginTop: 20, marginLeft: 100 }}>
            <p>
              Hisobingiz yo'qmi?{' '}
              <Link className="register-link" to="/register">
                Ro'yxatdan o'tish
              </Link>
            </p>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
