import {
  Container,
  Input,
  Title,
  Text,
  SimpleGrid,
  Center,
  Loader,
  Paper,
  Flex,
  Modal,
  Button,
  TextInput,
  FocusTrap,
  FileInput,
  Group,
  ScrollArea,
} from '@mantine/core';
import { rem } from '@mantine/core';
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
import BookCard from '../../components/bookCard/BookCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API } from '../../api/api';
import { useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { queryClient } from '../../main';
import useAuthStore from '../store/useAuthStore';

const Book = () => {
  const [search, setSearch] = useState('');
  const { isAuth } = useAuthStore();

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
          message: 'Kitob muvaffaqiyatli qo‘shildi',
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

        {
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
        }
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
          message: "Kitob muvaffaqiyatli qo'shildi",
          color: 'green',
        });
        handleCloseMulti();
        queryClient.invalidateQueries(['books']);
      },
      onError: () => {
        notifications.show({
          title: "Kitoblarni qo'shishda xatolik",
        });
      },
    });
  }

  if (isLoading) {
    return (
      <Container className="mt-[100px] mb-[100px]">
        <Center>
          <Loader size="xl" variant="dots" />
        </Center>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="mt-[100px] mb-[100px]">
        <Center style={{ flexDirection: 'column' }}>
          <IconAlertCircle size={48} color="red" />
          <Title order={3} color="red" mt="md">
            Xatolik yuz berdi.
          </Title>
        </Center>
      </Container>
    );
  }

  return (
    <>
      <Container size="xl" className="mt-[80px] mb-[100px]">
        <Paper radius="lg" p="xl">
          <div className="mb-10 text-center">
            <Title order={1} style={{ fontSize: '2.5rem' }}>
              📚 Kitoblar Katalogi
            </Title>
            <Text color="dimmed" size="lg">
              Kutubxonamizdagi barcha kitoblarni qidiring.
            </Text>
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kitob nomini qidirish..."
            icon={<IconSearch size={20} />}
            size="xl"
            variant="filled"
            className="mb-12"
          />
          {filteredBooks?.length === 0 && (
            <Center style={{ height: 250, flexDirection: 'column' }}>
              <IconMoodEmpty size={60} />
              <Text size="xl" weight={600} mt="md">
                "{search}" bo‘yicha hech narsa topilmadi
              </Text>
              <Text color="dimmed">Boshqa so‘z bilan urinib ko‘ring.</Text>
            </Center>
          )}
          Dilshod Umbarov, [12/13/2025 2:32 PM]
          {filteredBooks && filteredBooks.length > 0 && (
            <SimpleGrid
              cols={4}
              mt="lg"
              spacing="xl"
              breakpoints={[
                { maxWidth: 'lg', cols: 3 },
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'sm', cols: 1 },
              ]}
            >
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </SimpleGrid>
          )}
        </Paper>

        <Modal opened={openedSingleModal} onClose={closeSingle} title="Bitta kitob qo‘shish">
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

            <Flex justify="flex-end" gap="sm" mt="lg">
              <Button variant="outline" onClick={closeSingle}>
                Bekor qilish
              </Button>
              <Button type="submit">Qo‘shish</Button>
            </Flex>
          </form>
        </Modal>

        <Modal
          opened={openedMultiModal}
          onClose={handleCloseMulti}
          title={
            <Text size="lg" fw={600}>
              📚 Bir nechta kitob qo‘shish
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
                label="Nechta kitob qo‘shasiz?"
                placeholder="Kitoblar soni"
                type="number"
                min={1}
                required
              />
              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button variant="outline" onClick={handleCloseMulti}>
                  Bekor qilish
                </Button>
                <Button type="submit">Keyingi</Button>
              </Flex>
            </form>
          )}

          {multiStep === 2 && (
            <form onSubmit={handleMultiBooksSubmit}>
              <Text size="sm" color="dimmed" mb="md">
                Jami {multiBooksData.length} ta kitob uchun ma'lumot kiriting.
              </Text>
              Dilshod Umbarov, [12/13/2025 2:32 PM]
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
              <Flex justify="space-between" gap="sm" mt="lg">
                <Button variant="outline" onClick={() => setMultiStep(1)}>
                  Orqaga
                </Button>
                <Button type="submit" loading={isAddingBooks} disabled={isAddingBooks}>
                  Qo‘shish
                </Button>
              </Flex>
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
            <Flex direction="column" gap="xl">
              <div className="flex flex-col items-center">
                <Text size="md" fw={500}>
                  Excel faylni shu yerga tanlang
                </Text>
                <Text size="sm" color="dimmed" style={{ textAlign: 'center', marginTop: rem(4) }}>
                  Faqat .xlsx yoki .xls formatidagi fayllar qo'llab-quvvatlanadi
                </Text>
              </div>
              <FileInput
                placeholder="Faylni tanlash uchun bosing"
                accept=".xlsx, .xls"
                leftSection={<IconFileSpreadsheet style={{ width: 18, height: 18 }} />}
                value={file}
                onChange={setFile}
                clearable
                size="lg"
              />
              Dilshod Umbarov, [12/13/2025 2:32 PM]
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
            </Flex>
          </form>
        </Modal>
      </Container>

      {isAuth && (
        <div className="fixed bottom-8 right-8">
          <Menu width={250} shadow="md">
            <Menu.Target>
              <Button>
                <LuPlus />
                <span className="ml-1"> Kitob qo‘shish</span>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={openSingle}>
                <Flex align="center" gap="xs">
                  <AiOutlineBook />
                  Bitta kitob qo‘shish
                </Flex>
              </Menu.Item>

              <Menu.Item onClick={openMulti}>
                {' '}
                <Flex align="center" gap="xs">
                  <FaBookMedical />
                  Bir nechta kitob qo‘shish
                </Flex>
              </Menu.Item>

              <Menu.Item onClick={openFile}>
                <Flex align="center" gap="xs">
                  <MdOutlineFileDownload />
                  Fayl yuklash
                </Flex>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
    </>
  );
};

export default Book;
