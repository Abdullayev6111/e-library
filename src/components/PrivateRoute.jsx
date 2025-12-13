import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Center, Loader, Stack, Text } from '@mantine/core';

const PrivateRoute = () => {
  const { isAuth, token } = useAuthStore();

  if (token === undefined) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="xl" />
          <Text size="lg" c="dimmed">
            Yuklanmoqda...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!isAuth || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
