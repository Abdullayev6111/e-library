import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Center, Loader, Stack } from '@mantine/core';
import { Text as MantineText } from '@mantine/core';

const PrivateRoute = () => {
  const { isAuth, token } = useAuthStore();

  if (token === undefined) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="xl" />
          <MantineText size="lg" c="dimmed">
            Yuklanmoqda...
          </MantineText>
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
