Siaap, langsung comot nih versi bersih tanpa `/api` yang tinggal klik tombol *copy* di pojok kanan atas blok kode:

```markdown
# Primedev Library API

Primedev Library API adalah backend service berbasis RESTful API yang dirancang untuk mengelola sistem manajemen perpustakaan digital secara efisien. Proyek ini dibangun menggunakan Node.js dan Express.js sebagai core framework, serta memanfaatkan Prisma ORM untuk interaksi database yang andal. 

Sistem ini dilengkapi dengan manajemen autentikasi berbasis token (JWT), pengelolaan profil pengguna, kategori buku, sirkulasi peminjaman, penyimpanan file cover buku menggunakan Cloudinary, serta pencatatan log terstruktur menggunakan Pino Logger untuk mempermudah proses debugging dan monitoring aplikasi.

---

## Folder Structure

Berikut adalah struktur direktori dari proyek Primedev Library API:

```text
Primedev-Library-Api/
├── prisma/
│   └── schema.prisma       # Definisi skema database & relasi ORM
├── src/
│   ├── configs/            # Konfigurasi database, Cloudinary, dan Pino Logger
│   ├── controllers/        # Logika bisnis utama (Auth, Users, Books, Borrowings, etc.)
│   ├── middlewares/        # Validasi input request dan autentikasi JWT
│   ├── routes/             # Definisi rute/endpoint API Express
│   └── utils/              # Fungsi helper dan utilitas tambahan
├── .env.example            # Template file environment variables
├── package.json            # Daftar dependencies dan script proyek
└── README.md               # Dokumentasi proyek

```

---

## API Routes

Gunakan tabel di bawah ini sebagai panduan endpoint beserta tingkat akses keamanan yang diperlukan:

### Autentikasi (/auth)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Registrasi akun pengguna baru | Publik |
| `POST` | `/auth/login` | Login pengguna untuk mendapatkan JWT Token | Publik |

### Manajemen Pengguna & Profil (/users & /profiles)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `GET` | `/users` | Mengambil seluruh daftar pengguna | Admin Only |
| `GET` | `/users/:id` | Mengambil detail pengguna berdasarkan ID | Login Required |
| `GET` | `/users/:id/profile` | Mengambil data pengguna beserta profil lengkap | Login Required |
| `POST` | `/users` | Membuat pengguna baru secara manual | Admin Only |
| `PUT` | `/users/:id` | Memperbarui informasi data pengguna | Login Required |
| `DELETE` | `/users/:id` | Menghapus data pengguna dari sistem | Admin Only |
| `POST` | `/profiles` | Membuat profil baru (Bio & Avatar) | Login Required |
| `PUT` | `/profiles/:id` | Memperbarui data profil pengguna | Login Required |

### Kategori & Buku (/categories & /books)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `GET` | `/categories` | Mengambil semua daftar kategori | Publik |
| `GET` | `/categories/:id` | Mengambil detail kategori berdasarkan ID | Publik |
| `GET` | `/categories/:id/books` | Mengambil semua daftar buku di kategori tertentu | Publik |
| `POST` | `/categories` | Membuat kategori buku baru | Admin / Staff |
| `PUT` | `/categories/:id` | Memperbarui nama atau deskripsi kategori | Admin / Staff |
| `DELETE` | `/categories/:id` | Menghapus kategori buku | Admin Only |
| `POST` | `/books` | Menambah buku baru beserta upload cover | Admin / Staff |

### Transaksi Peminjaman (/borrowings)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `GET` | `/borrowings` | Mengambil seluruh riwayat transaksi peminjaman | Admin / Staff |
| `GET` | `/borrowings/:id` | Mengambil detail spesifik transaksi peminjaman | Login Required |
| `POST` | `/borrowings` | Melakukan proses peminjaman buku (set available = false) | Login Required |
| `PUT` | `/borrowings/:id/return` | Melakukan proses pengembalian buku (set available = true) | Login Required |
| `DELETE` | `/borrowings/:id` | Menghapus data riwayat transaksi peminjaman | Admin Only |

### Manajemen Ulasan (/reviews)

Rute ini digunakan untuk mengelola data ulasan, komentar, dan rating yang diberikan oleh pengguna terhadap buku yang ada di perpustakaan.

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/books/:bookId/reviews` | Mengambil semua daftar ulasan untuk satu buku tertentu | Login Required |
| `POST` | `/reviews` | Membuat ulasan dan rating baru untuk buku | Login Required |

buat yang lain besok aja😴


> **Keterangan Hak Akses:**
> * **Publik:** Dapat diakses langsung tanpa token.
> * **Login Required:** Membutuhkan validasi header `Authorization: Bearer <token>` (User & Admin).
> * **Admin Only / Staff:** Membutuhkan token dengan payload `role: "ADMIN"` atau staf yang berwenang.

---

## Author

* **Nama:** Pande Komang Surya Adnyana
* **Peran:** Backend Developer
* **GitHub:** [@Tsurya-azha](https://www.google.com/search?q=https://github.com/Tsurya-azha)

```

```
