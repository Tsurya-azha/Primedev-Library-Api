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

### Autentikasi (/api/auth)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `POST` | `/register` | Registrasi akun pengguna baru | Publik |
| `POST` | `/login` | Login pengguna untuk mendapatkan JWT Token | Publik |

### Manajemen Pengguna & Profil (/api/users & /api/profiles)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `GET` | `/api/users` | Mengambil seluruh daftar pengguna | Admin Only |
| `GET` | `/api/users/:id` | Mengambil detail pengguna berdasarkan ID | Login Required |
| `GET` | `/api/users/:id/profile` | Mengambil data pengguna beserta profil lengkap | Login Required |
| `POST` | `/api/users` | Membuat pengguna baru secara manual | Admin Only |
| `PUT` | `/api/users/:id` | Memperbarui informasi data pengguna | Login Required |
| `DELETE` | `/api/users/:id` | Menghapus data pengguna dari sistem | Admin Only |
| `POST` | `/api/profiles` | Membuat profil baru (Bio & Avatar) | Login Required |
| `PUT` | `/api/profiles/:id` | Memperbarui data profil pengguna | Login Required |

### Kategori & Buku (/api/categories & /api/books)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | Mengambil semua daftar kategori | Publik |
| `GET` | `/api/categories/:id` | Mengambil detail kategori berdasarkan ID | Publik |
| `GET` | `/api/categories/:id/books` | Mengambil semua daftar buku di kategori tertentu | Publik |
| `POST` | `/api/categories` | Membuat kategori buku baru | Admin / Staff |
| `PUT` | `/api/categories/:id` | Memperbarui nama atau deskripsi kategori | Admin / Staff |
| `DELETE` | `/api/categories/:id` | Menghapus kategori buku | Admin Only |
| `POST` | `/api/books` | Menambah buku baru beserta upload cover | Admin / Staff |

### Transaksi Peminjaman (/api/borrowings)

| Method | Endpoint | Deskripsi | Hak Akses |
| --- | --- | --- | --- |
| `GET` | `/` | Mengambil seluruh riwayat transaksi peminjaman | Admin / Staff |
| `GET` | `/:id` | Mengambil detail spesifik transaksi peminjaman | Login Required |
| `POST` | `/` | Melakukan proses peminjaman buku (set available = false) | Login Required |
| `PUT` | `/:id/return` | Melakukan proses pengembalian buku (set available = true) | Login Required |
| `DELETE` | `/:id` | Menghapus data riwayat transaksi peminjaman | Admin Only |

> **Keterangan Hak Akses:**
> * **Publik:** Dapat diakses langsung tanpa token.
> * **Login Required:** Membutuhkan validasi header `Authorization: Bearer <token>` (User & Admin).
> * **Admin Only / Staff:** Membutuhkan token dengan payload `role: "ADMIN"` atau staf yang berwenang.
> 
> 

---

## Author

* **Nama:** Pande Komang Surya Adnyana
* **Peran:** Backend Developer

```

```
