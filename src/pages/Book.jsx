import {
  Container,
  Input,
  Title,
  Text,
  SimpleGrid,
  Center,
  Loader,
  Paper,
  Modal,
  Button,
  TextInput,
  FocusTrap,
  FileInput,
  Group,
  ScrollArea,
  Box,
  Stack,
} from '@mantine/core';
import {
  IconSearch,
  IconAlertCircle,
  IconMoodEmpty,
  IconUpload,
  IconFileSpreadsheet,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { AiOutlineBook } from 'react-icons/ai';
import { FaBookMedical } from 'react-icons/fa';
import { LuPlus } from 'react-icons/lu';
import { MdOutlineFileDownload } from 'react-icons/md';
import { Menu } from '@mantine/core';
import CardEl from '../components/CardEl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../api/Api';
import { useRef, useState } from 'react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import useAuthStore from '../store/useAuthStore';

const Book = () => {
  const [search, setSearch] = useState('');
  const { isAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const [openedSingleModal, { open: openSingle, close: closeSingle }] = useDisclosure(false);
  const [openedFileModal, { open: openFile, close: closeFile }] = useDisclosure(false);

  const [openedMultiModal, { open: openMulti, close: closeMulti }] = useDisclosure(false);
  const [multiStep, setMultiStep] = useState(1);
  const [multiBooksData, setMultiBooksData] = useState([]);

  const [file, setFile] = useState(null);

  const kitobRef = useRef();
  const muallifRef = useRef();
  const nashriyotRef = useRef();
  const soniRef = useRef();

  const multiRefs = useRef([]);

  const [editingBook, setEditingBook] = useState(null);
  const [openedEditModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  const editKitobRef = useRef();
  const editMuallifRef = useRef();
  const editNashriyotRef = useRef();
  const editSoniRef = useRef();

  const { mutate: deleteBook } = useMutation({
    mutationFn: (id) => API.delete(`/books/book/${id}/`),
  });

  const { mutate: updateBook } = useMutation({
    mutationFn: ({ id, data }) => API.put(`/books/book/${id}/`, data),
  });

  const handleEdit = (book) => {
    setEditingBook(book);
    openEdit();
  };

  const handleDelete = (book) => {
    modals.openConfirmModal({
      title: "Kitobni o'chirish",
      centered: true,
      children: (
        <Text size="sm">
          <strong>{book.name}</strong> kitobini o'chirishga ishonchingiz komilmi? Bu amalni bekor
          qilish mumkin emas
        </Text>
      ),
      labels: { confirm: "O'chirish", cancel: 'Bekor qilish' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteBook(book.id, {
          onSuccess: () => {
            notifications.show({
              title: 'Muvaffaqiyat!',
              message: "Kitob muvaffaqiyatli o'chirildi",
              color: 'green',
            });
            queryClient.invalidateQueries(['books']);
          },
          onError: (error) => {
            notifications.show({
              title: 'Xatolik',
              message: error.response?.data?.detail || "Kitobni o'chirishda xatolik yuz berdi",
              color: 'red',
            });
          },
        });
      },
    });
  };

  function handleSubmitBookEdit(e) {
    e.preventDefault();

    const updatedData = {
      name: editKitobRef.current.value,
      author: editMuallifRef.current.value,
      publisher: editNashriyotRef.current.value,
      quantity_in_library: parseInt(editSoniRef.current.value, 10),
    };

    updateBook(
      { id: editingBook.id, data: updatedData },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Muvaffaqiyat!',
            message: 'Kitob muvaffaqiyatli yangilandi',
            color: 'green',
          });
          closeEdit();
          setEditingBook(null);
          queryClient.invalidateQueries(['books']);
        },
        onError: (error) => {
          notifications.show({
            title: 'Xatolik',
            message: error.response?.data?.detail || 'Xatolik yuz berdi',
            color: 'red',
          });
        },
      }
    );
  }

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['books'],
    queryFn: () => API.get('/books/books').then((res) => res.data),
  });

  const { mutate: createBook } = useMutation({
    mutationFn: (body) => API.post('/books/books/', body),
  });

  const { mutate: uploadExcelFile, isPending: isUploading } = useMutation({
    mutationFn: (formData) => API.post('/books/upload-excel/', formData),
  });

  const { mutate: addBooks, isPending: isAddingBooks } = useMutation({
    mutationFn: (booksList) => API.post('/books/add-books/', booksList),
  });

  const isProcessing = isUploading || isAddingBooks;

  const filteredBooks = books?.filter((book) =>
    book?.name?.trim('').toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmitBookCreate(e) {
    e.preventDefault();

    const body = {
      name: kitobRef.current.value,
      author: muallifRef.current.value,
      publisher: nashriyotRef.current.value,
      quantity_in_library: soniRef.current.value,
    };

    createBook(body, {
      onSuccess: () => {
        notifications.show({
          message: "Kitob muvaffaqiyatli qo'shildi",
          color: 'green',
        });
        closeSingle();
        queryClient.invalidateQueries(['books']);
      },
      onError: () => {
        notifications.show({
          message: 'Xatolik yuz berdi',
          color: 'red',
        });
      },
    });
  }

  const handleSubmitFileUpload = (e) => {
    e.preventDefault();

    if (!file) {
      notifications.show({
        message: 'Iltimos, yuklash uchun fayl tanlang.',
        color: 'yellow',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    uploadExcelFile(formData, {
      onSuccess: (res) => {
        const booksFile = res.data;

        addBooks(booksFile, {
          onSuccess: () => {
            notifications.show({
              title: 'Muvaffaqiyat!',
              message: "Kitob muvaffaqiyatli qo'shildi",
              color: 'green',
            });
            setFile(null);
            closeFile();
            queryClient.invalidateQueries(['books']);
          },
          onError: (addError) => {
            notifications.show({
              title: "Kitoblarni qo'shishda xatolik",
              message: addError.response?.data?.detail || "Ma'lumotlar formati noto'g'ri.",
              color: 'red',
            });
          },
        });
      },
      onError: (uploadError) => {
        notifications.show({
          title: 'Fayl yuklashda xatolik',
          message: uploadError.response?.data?.detail || 'Faylni yuklashda muammo yuz berdi.',
          color: 'red',
        });
      },
    });
  };

  function handleCloseMulti() {
    setMultiStep(1);
    setMultiBooksData([]);
    multiRefs.current = [];
    closeMulti();
  }

  function handleCountSubmit(e) {
    e.preventDefault();

    const count = parseInt(multiRefs.current[0].value);

    if (count > 0) {
      const initialData = Array.from({ length: count }, () => ({
        name: '',
        author: '',
        publisher: '',
        quantity_in_library: 1,
      }));
      setMultiBooksData(initialData);

      setMultiStep(2);
    } else {
      notifications.show({
        message: "Kitoblar soni 0 dan katta bo'lishi kerak.",
        color: 'yellow',
      });
    }
  }

  function handleMultiInputChange(index, field, value) {
    setMultiBooksData((prevData) => {
      const newData = [...prevData];
      let newValue = value;

      if (field === 'quantity_in_library') {
        const parsedValue = parseInt(value, 10);
        newValue = isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue;
      }

      newData[index] = { ...newData[index], [field]: newValue };
      return newData;
    });
  }

  function handleMultiBooksSubmit(e) {
    e.preventDefault();

    addBooks(multiBooksData, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyat!',
          message: "Kitoblar muvaffaqiyatli qo'shildi",
          color: 'green',
        });
        handleCloseMulti();
        queryClient.invalidateQueries(['books']);
      },
      onError: (error) => {
        notifications.show({
          title: "Kitoblarni qo'shishda xatolik",
          message: error.response?.data?.detail || 'Xatolik yuz berdi',
          color: 'red',
        });
      },
    });
  }

  if (isLoading) {
    return (
      <Container mt={100} mb={100}>
        <Center>
          <Loader size="xl" variant="dots" />
        </Center>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container mt={100} mb={100}>
        <Stack align="center">
          <IconAlertCircle size={48} color="red" />
          <Title order={3} c="red" mt="md">
            Xatolik yuz berdi.
          </Title>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Container style={{ maxWidth: 1440 }} size="xl" mt={80} mb={100}>
        <Paper radius="lg" p="xl">
          <Stack mb={40} align="center">
            <Title order={1} style={{ fontSize: '2.5rem' }}>
              Kitoblar Ro'yxati
            </Title>
            <Text c="dimmed" size="lg">
              Kutubxonadagi barcha kitoblarni qidiring
            </Text>
          </Stack>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kitob nomini qidirish..."
            leftSection={<IconSearch size={20} />}
            size="xl"
            variant="filled"
            mb={48}
          />

          {filteredBooks?.length === 0 && (
            <Center h={250}>
              <Stack align="center">
                <IconMoodEmpty size={60} />
                <Text size="xl" fw={600} mt="md">
                  "{search}" bo'yicha hech narsa topilmadi
                </Text>
                <Text c="dimmed">Boshqa so'z bilan urinib ko'ring.</Text>
              </Stack>
            </Center>
          )}

          {filteredBooks && filteredBooks.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} mt="lg" spacing="xl">
              {filteredBooks.map((book) => (
                <CardEl key={book.id} post={book} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </SimpleGrid>
          )}
        </Paper>

        <Modal
          opened={openedEditModal}
          onClose={() => {
            closeEdit();
            setEditingBook(null);
          }}
          title="Kitobni tahrirlash"
        >
          <form onSubmit={handleSubmitBookEdit}>
            <TextInput
              ref={editKitobRef}
              label="Kitob nomi"
              placeholder="Kitob nomi"
              defaultValue={editingBook?.name}
              required
            />
            <TextInput
              ref={editMuallifRef}
              label="Muallif"
              placeholder="Muallif"
              defaultValue={editingBook?.author}
              mt="md"
              required
            />
            <TextInput
              ref={editNashriyotRef}
              label="Nashriyot"
              placeholder="Nashriyot"
              defaultValue={editingBook?.publisher}
              mt="md"
            />
            <TextInput
              ref={editSoniRef}
              type="number"
              label="Kitoblar soni"
              placeholder="Kitoblar soni"
              defaultValue={editingBook?.quantity_in_library}
              mt="md"
              min={1}
              required
            />

            <Group justify="flex-end" gap="sm" mt="lg">
              <Button
                variant="outline"
                onClick={() => {
                  closeEdit();
                  setEditingBook(null);
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit">Saqlash</Button>
            </Group>
          </form>
        </Modal>

        <Modal opened={openedSingleModal} onClose={closeSingle} title="Bitta kitob qo'shish">
          <form onSubmit={handleSubmitBookCreate}>
            <FocusTrap.InitialFocus />

            <TextInput ref={kitobRef} label="Kitob nomi" placeholder="Kitob nomi" required />
            <TextInput ref={muallifRef} label="Muallif" placeholder="Muallif" mt="md" required />
            <TextInput ref={nashriyotRef} label="Nashriyot" placeholder="Nashriyot" mt="md" />
            <TextInput
              ref={soniRef}
              type="number"
              label="Kitoblar soni"
              placeholder="Kitoblar soni"
              mt="md"
              min={1}
              required
            />

            <Group justify="flex-end" gap="sm" mt="lg">
              <Button variant="outline" onClick={closeSingle}>
                Bekor qilish
              </Button>
              <Button type="submit">Qo'shish</Button>
            </Group>
          </form>
        </Modal>

        <Modal
          opened={openedMultiModal}
          onClose={handleCloseMulti}
          title={
            <Text size="lg" fw={600}>
              📚 Bir nechta kitob qo'shish
            </Text>
          }
          centered
          size="xl"
          scrollAreaComponent={ScrollArea.Autosize}
        >
          {multiStep === 1 && (
            <form onSubmit={handleCountSubmit}>
              <TextInput
                ref={(el) => (multiRefs.current[0] = el)}
                label="Nechta kitob qo'shasiz?"
                placeholder="Kitoblar soni"
                type="number"
                min={1}
                required
              />
              <Group justify="flex-end" gap="sm" mt="lg">
                <Button variant="outline" onClick={handleCloseMulti}>
                  Bekor qilish
                </Button>
                <Button type="submit">Keyingi</Button>
              </Group>
            </form>
          )}

          {multiStep === 2 && (
            <form onSubmit={handleMultiBooksSubmit}>
              <Text size="sm" c="dimmed" mb="md">
                Jami {multiBooksData.length} ta kitob uchun ma'lumot kiriting.
              </Text>
              {multiBooksData.map((book, index) => (
                <Paper key={index} shadow="xs" p="md" withBorder mb="lg">
                  <Title order={4} mb="sm">
                    Kitob {index + 1} / {multiBooksData.length}
                  </Title>
                  <TextInput
                    label="Kitob nomi"
                    placeholder="Kitob nomi"
                    required
                    value={book.name}
                    onChange={(e) => handleMultiInputChange(index, 'name', e.target.value)}
                  />
                  <TextInput
                    label="Muallif"
                    placeholder="Muallif"
                    mt="md"
                    required
                    value={book.author}
                    onChange={(e) => handleMultiInputChange(index, 'author', e.target.value)}
                  />
                  <TextInput
                    label="Nashriyot"
                    placeholder="Nashriyot"
                    mt="md"
                    value={book.publisher}
                    onChange={(e) => handleMultiInputChange(index, 'publisher', e.target.value)}
                  />
                  <TextInput
                    label="Kitoblar soni"
                    placeholder="Kitoblar soni"
                    type="number"
                    min={1}
                    required
                    mt="md"
                    value={book.quantity_in_library}
                    onChange={(e) =>
                      handleMultiInputChange(index, 'quantity_in_library', e.target.value)
                    }
                  />
                </Paper>
              ))}
              <Group justify="space-between" gap="sm" mt="lg">
                <Button variant="outline" onClick={() => setMultiStep(1)}>
                  Orqaga
                </Button>
                <Button type="submit" loading={isAddingBooks} disabled={isAddingBooks}>
                  Qo'shish
                </Button>
              </Group>
            </form>
          )}
        </Modal>

        <Modal
          opened={openedFileModal}
          onClose={closeFile}
          title={
            <Text size="lg" fw={600}>
              📚 Kutubxona Ma'lumotlarini Yuklash
            </Text>
          }
          centered
        >
          <form onSubmit={handleSubmitFileUpload}>
            <Stack gap="xl">
              <Stack align="center">
                <Text size="md" fw={500}>
                  Excel faylni shu yerga tanlang
                </Text>
                <Text size="sm" c="dimmed" ta="center" mt={4}>
                  Faqat .xlsx yoki .xls formatidagi fayllar qo'llab-quvvatlanadi
                </Text>
              </Stack>

              <FileInput
                placeholder="Faylni tanlash uchun bosing"
                accept=".xlsx, .xls"
                leftSection={<IconFileSpreadsheet style={{ width: 18, height: 18 }} />}
                value={file}
                onChange={setFile}
                clearable
                size="lg"
              />

              <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={closeFile}>
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconUpload style={{ width: 18, height: 18 }} />}
                  disabled={!file || isProcessing}
                  loading={isProcessing}
                >
                  {isAddingBooks ? "Kitoblar qo'shilmoqda..." : 'Yuklash'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>

      {isAuth && (
        <Box
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
          }}
        >
          <Menu width={250} shadow="md">
            <Menu.Target>
              <Button size="lg">
                <LuPlus />
                <Box component="span" ml={4}>
                  Kitob qo'shish
                </Box>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={openSingle}>
                <Group gap="xs">
                  <AiOutlineBook />
                  <Text>Bitta kitob qo'shish</Text>
                </Group>
              </Menu.Item>

              <Menu.Item onClick={openMulti}>
                <Group gap="xs">
                  <FaBookMedical />
                  <Text>Bir nechta kitob qo'shish</Text>
                </Group>
              </Menu.Item>

              <Menu.Item onClick={openFile}>
                <Group gap="xs">
                  <MdOutlineFileDownload />
                  <Text>Fayl yuklash</Text>
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      )}
    </>
  );
};

export default Book;
