const express = require("express");
const app = express();
const PORT = 3000;

// Middleware untuk membaca request body berformat JSON
app.use(express.json());

// In-Memory Data Store (Array JavaScript)
let biodataList = [
  {
    id: 1,
    nama: "Budi Santoso",
    umur: 22,
    alamat: "Jl. Merdeka No. 10, Jakarta",
    pekerjaan: "Software Engineer",
  },
  {
    id: 2,
    nama: "Siti Rahma",
    umur: 20,
    alamat: "Jl. Mawar No. 5, Bandung",
    pekerjaan: "UI/UX Designer",
  },
];

// Variable auto-increment ID berikutnya
let nextId = 3;

// ==========================================
// ROUTING & ENDPOINT CRUD
// ==========================================

// 1. GET /api/biodata - Menampilkan seluruh data biodata
app.get("/api/biodata", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Berhasil mengambil seluruh daftar biodata",
    data: biodataList,
  });
});

// 2. GET /api/biodata/:id - Menampilkan detail 1 biodata berdasarkan ID
app.get("/api/biodata/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = biodataList.find((b) => b.id === id);

  if (!item) {
    return res.status(404).json({
      status: "fail",
      message: `Biodata dengan ID ${id} tidak ditemukan`,
      data: null,
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Berhasil mengambil detail biodata",
    data: item,
  });
});

// 3. POST /api/biodata - Menambahkan biodata baru
app.post("/api/biodata", (req, res) => {
  const { nama, umur, alamat, pekerjaan } = req.body;

  // Validasi: Semua field wajib diisi
  if (!nama || !umur || !alamat || !pekerjaan) {
    return res.status(400).json({
      status: "fail",
      message:
        "Input tidak lengkap. Field (nama, umur, alamat, pekerjaan) wajib diisi!",
      data: null,
    });
  }

  const newBiodata = {
    id: nextId++,
    nama: nama,
    umur: Number(umur),
    alamat: alamat,
    pekerjaan: pekerjaan,
  };

  biodataList.push(newBiodata);

  return res.status(201).json({
    status: "success",
    message: "Biodata baru berhasil ditambahkan",
    data: newBiodata,
  });
});

// 4. PUT /api/biodata/:id - Mengubah data biodata berdasarkan ID
app.put("/api/biodata/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = biodataList.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: `Gagal mengupdate. Biodata dengan ID ${id} tidak ditemukan`,
      data: null,
    });
  }

  const { nama, umur, alamat, pekerjaan } = req.body;

  // Memperbarui data (menggunakan data baru jika dikirim, atau memakai data lama)
  biodataList[index] = {
    ...biodataList[index],
    ...(nama && { nama }),
    ...(umur && { umur: Number(umur) }),
    ...(alamat && { alamat }),
    ...(pekerjaan && { pekerjaan }),
  };

  return res.status(200).json({
    status: "success",
    message: `Biodata dengan ID ${id} berhasil diperbarui`,
    data: biodataList[index],
  });
});

// 5. DELETE /api/biodata/:id - Menghapus biodata berdasarkan ID
app.delete("/api/biodata/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = biodataList.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: `Gagal menghapus. Biodata dengan ID ${id} tidak ditemukan`,
      data: null,
    });
  }

  const deletedItem = biodataList.splice(index, 1)[0];

  return res.status(200).json({
    status: "success",
    message: `Biodata dengan ID ${id} berhasil dihapus`,
    data: deletedItem,
  });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server RESTful API berjalan di http://localhost:${PORT}`);
});
