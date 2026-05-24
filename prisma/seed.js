import prisma from '../configs/database.config.js';
import logger from '../configs/pino.config.js';

async function main() {
  logger.info("Mulai membersihkan database...");

  // 1. Bersihkan tabel dari bawah (child) ke atas (parent) agar tidak kena error relasi
  await prisma.borrowings.deleteMany();
  await prisma.profiles.deleteMany();
  await prisma.books.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.users.deleteMany();

  logger.info("Database berhasil dibersihkan! Mulai melakukan seeding...");

  // 2. Seeding Categories (20 Data)
  const categoryNames = [
    'Fiksi Ilmiah', 'Fantasi', 'Sejarah', 'Biografi', 'Sains', 
    'Matematika', 'Teknologi', 'Seni', 'Desain', 'Pengembangan Diri', 
    'Bisnis', 'Ekonomi', 'Kesehatan', 'Komik', 'Misteri', 
    'Romansa', 'Agama', 'Psikologi', 'Pendidikan', 'Filosofi'
  ];
  
  const createdCategories = [];
  for (const name of categoryNames) {
    const category = await prisma.categories.create({
      data: { name }
    });
    createdCategories.push(category);
  }
  logger.info(`Berhasil membuat ${createdCategories.length} Categories.`);

  // 3. Seeding Users & Profiles (20 Data sekaligus menggunakan nested create)
  const createdUsers = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.users.create({
      data: {
        name: `Pengguna ${i}`,
        email: `user${i}@example.com`,
        password: `password_rahasia_${i}`, // Di real app, gunakan bcrypt.hash()
        role: i === 1 ? 'ADMIN' : 'USER', // User pertama jadi admin
        profiles: {
          create: {
            address: `Jalan Sudirman Blok C No. ${i}, Jakarta`,
            phone: `08120000${i.toString().padStart(4, '0')}`
          }
        }
      }
    });
    createdUsers.push(user);
  }
  logger.info(`Berhasil membuat ${createdUsers.length} Users beserta Profiles-nya.`);

  // 4. Seeding Books (25 Data)
  const createdBooks = [];
  for (let i = 1; i <= 25; i++) {
    // Ambil ID Kategori secara acak dari data yang baru dibuat
    const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    
    const book = await prisma.books.create({
      data: {
        categoryId: randomCategory.id, // ID diambil dinamis dari database
        title: `Buku Panduan Menjadi Ahli Edisi ${i}`,
        author: `Penulis Handal ${i}`,
        year: 2000 + (i % 24), // Tahun antara 2000 - 2023
        available: true
      }
    });
    createdBooks.push(book);
  }
  logger.info(`Berhasil membuat ${createdBooks.length} Books.`);

  // 5. Seeding Borrowings (20 Data)
  const createdBorrowings = [];
  for (let i = 1; i <= 20; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomBook = createdBooks[Math.floor(Math.random() * createdBooks.length)];
    
    // Setengah data peminjaman sudah dikembalikan, setengahnya belum
    const isReturned = i % 2 === 0;

    const borrowing = await prisma.borrowings.create({
      data: {
        userId: randomUser.id,
        bookId: randomBook.id,
        returned_at: isReturned ? new Date() : null
      }
    });
    createdBorrowings.push(borrowing);
  }
  logger.info(`Berhasil membuat ${createdBorrowings.length} Borrowings.`);

  logger.info("Seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    logger.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Putuskan koneksi Prisma setelah selesai
    await prisma.$disconnect();
  });