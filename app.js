const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const multer = require('multer');
const bodyParser = require('body-parser');

const {body, validationResult, check} = require ('express-validator')
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const {Surat1, Surat2, Surat3, Surat4, fileSurat1, fileSurat2, fileSurat3, fileSurat4} = require('./model/surat1');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set up method override
app.use(methodOverride('_method'));

// Set up Menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(flash());

// Ini Halaman Home
app.get('/', async (req, res) => {
    res.render('home', { 
      layout : 'layouts/home-layout'
    });
  });

// Ini Halaman login
app.get('/login', async (req, res) => {
    res.render('login', { 
      layout : 'layouts/login-layout'
    });
  });



// Ini Halaman register
app.get('/register', async (req, res) => {
    res.render('register', { 
      layout : 'layouts/login-layout'
    });
  });

// Halaman Arsip Surat Domain 
app.get('/arsip', async (req, res) => {
  const surat1 = await Surat1.find();
  res.render('arsip-domain', { 
    layout : 'layouts/arsip-layout',
    msg: req.flash('msg'),
    surat1,
  });
});

// Halaman Arsip Surat Ganti Admin 
app.get('/arsip-adm', async (req, res) => {
  const surat1 = await Surat2.find();
  res.render('arsip-gantiadm', { 
    layout : 'layouts/arsip-layout',
    msg: req.flash('msg'),
    surat1,
  });
});

// Halaman Arsip Surat Kuasa 
app.get('/arsip-kuasa', async (req, res) => {
  const surat1 = await Surat3.find();
  res.render('arsip-kuasa', { 
    layout : 'layouts/arsip-layout',
    msg: req.flash('msg'),
    surat1,
  });
});

// Halaman Arsip Surat Tugas 
app.get('/arsip-tugas', async (req, res) => {
  const surat1 = await Surat4.find();
  res.render('arsip-tugas', { 
    layout : 'layouts/arsip-layout',
    msg: req.flash('msg'),
    surat1,
  });
});

  // Halaman surat domain
  app.get('/surat-domain', async (req, res) => {
    const surats = await Surat1.find();
    res.render('SuratDomain', {
      tittle: 'Surat Domain',
      surats,
      layout: 'layouts/main-layout',
    })
  });

// Proses tambah data surat domain
app.post('/surat-domain-1', [
  check('lampiran').isNumeric(), 
  check('noHP', 'Nomor HP tidak valid!').isMobilePhone('id-ID')
], (req ,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('surat-domain', {
      tittle: 'Form Tambah Data Surat Domain',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    })
  } else {
  Surat1.insertMany(req.body, (error, result) => {
    // Mengirimkan flash message
    req.flash('msg', 'Data surat berhasil ditambahkan!');
    res.redirect('/buat-surat-domain');
  });

  }
});

// Form Edit Surat Domain
app.get('/download-surat-domain', async (req, res) => {
  const surat1 = await Surat1.findOne({}).sort({createdAt: -1});
  res.render('DownloadSuratDomain', {
    tittle: 'Surat Domain',
    surat1,
    layout: 'layouts/main-layout',
  })
});

function formatTgl(date) {

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

// Proses download surat domain
app.get('/buat-surat-domain', async (req, res) => {
  const surat1 = await Surat1.findOne({}).sort({createdAt: -1})
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-domain.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    lampiran: surat1.lampiran,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    namaPengurusWeb: surat1.namaPengurusWeb,
    noHP: surat1.noHP,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatan: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratDomain-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});

// Proses download surat domain pada arsip
app.get('/buat-surat-domain/:_id', async (req, res) => {
  const surat1 = await Surat1.findOne({_id: req.params._id})
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-domain.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    lampiran: surat1.lampiran,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    namaPengurusWeb: surat1.namaPengurusWeb,
    noHP: surat1.noHP,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatan: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratDomain-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});

// Halaman surat ganti admin
app.get('/surat-ganti-admin', (req, res) => {
    res.render('SuratGantiAdmin', {
      tittle: 'Surat Ganti Admin',
      layout: 'layouts/main-layout',
    })
  });
  
// Proses tambah data surat ganti admin
app.post('/surat-ganti-admin', [
  check('lampiran').isNumeric(), 
  check('noHP', 'Nomor HP tidak valid!').isMobilePhone('id-ID')
], (req ,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('/surat-ganti-admin', {
      tittle: 'Form Tambah Data Surat Ganti Admin',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    })
  } else {
  Surat2.insertMany(req.body, (error, result) => {
    // Mengirimkan flash message
    req.flash('msg', 'Data surat berhasil ditambahkan!');
    res.redirect('/buat-surat-ganti-admin');
  });
  }
});

// Proses buat surat ganti admin
app.get('/buat-surat-ganti-admin', async (req, res) => {
  const surat1 = await Surat2.findOne({}).sort({createdAt: -1});
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-ganti-admin.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    lampiran: surat1.lampiran,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    nik: surat1.nik,
    namaAdmin: surat1.namaAdmin,
    jabatan: surat1.jabatan,
    noHP: surat1.noHP,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatan: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratGantiAdmin-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});

// Proses Download surat ganti admin pada arsip
app.get('/buat-surat-ganti-admin/:_id', async (req, res) => {
  const surat1 = await Surat2.findOne({_id: req.params._id})
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-ganti-admin.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    lampiran: surat1.lampiran,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    nik: surat1.nik,
    namaAdmin: surat1.namaAdmin,
    jabatan: surat1.jabatan,
    noHP: surat1.noHP,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatan: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratGantiAdmin-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});
  
  // Halaman surat kuasa
  app.get('/surat-kuasa', (req, res) => {
    res.render('SuratKuasa', {
      tittle: 'Surat Kuasa',
      layout: 'layouts/main-layout',
    })
  });

// Proses tambah data surat kuasa
app.post('/surat-kuasa', [ 
], (req ,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('/surat-kuasa', {
      tittle: 'Form Tambah Data Surat Kuasa',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    })
  } else {
  Surat3.insertMany(req.body, (error, result) => {
    // Mengirimkan flash message
    req.flash('msg', 'Data surat berhasil ditambahkan!');
    res.redirect('/buat-surat-kuasa');
  });
  }
});

// Proses buat surat kuasa
app.get('/buat-surat-kuasa', async (req, res) => {
  const surat1 = await Surat3.findOne({}).sort({createdAt: -1});
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-kuasa.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    namaKecamatan: surat1.namaKecamatan,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    nik: surat1.nik,
    noHP: surat1.noHP,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatanKop: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratKuasa-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});

// Proses download surat kuasa pada arsip
app.get('/buat-surat-kuasa/:_id', async (req, res) => {
  const surat1 = await Surat3.findOne({_id: req.params._id});
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-kuasa.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    dsrTugas: surat1.dsrTugas,
    noSurat: surat1.noSurat,
    namaKecamatan: surat1.namaKecamatan,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    nik: surat1.nik,
    noHP: surat1.noHP,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatanKop: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratKuasa-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});
  
  // Halaman surat tugas
  app.get('/surat-tugas', (req, res) => {
    res.render('SuratTugas', {
      tittle: 'Surat Tugas',
      layout: 'layouts/main-layout'
    })
  });

// Proses tambah data surat tugas
app.post('/surat-tugas', (req ,res) => {
  Surat4.insertMany(req.body, (error, result) => {
    // Mengirimkan flash message
    req.flash('msg', 'Data surat berhasil ditambahkan!');
    res.redirect('/buat-surat-tugas');
  });
  }
);

// Proses buat surat tugas
app.get('/buat-surat-tugas', async (req, res) => {
  const surat1 = await Surat4.findOne({}).sort({createdAt: -1});
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-tugas.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    dsrTugas: surat1.dsrTugas,
    namaKecamatan: surat1.namaKecamatan,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    namaDitugaskan: surat1.namaDitugaskan,
    niap: surat1.niap,
    jabatan: surat1.jabatan,
    namaDitugaskan2: surat1.namaDitugaskan2,
    niap2: surat1.niap2,
    jabatan2: surat1.jabatan2,
    tujuan: surat1.tujuan,
    tujuan2: surat1.tujuan,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatanKop: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratTugas-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});

// Proses download surat tugas pada arsip
app.get('/buat-surat-tugas/:_id', async (req, res) => {
  const surat1 = await Surat4.findOne({_id: req.params._id});
  const inputDate = new Date(surat1.tgl);
  const formattedDate = formatTgl(inputDate);
  const content = fs.readFileSync(
    path.resolve(__dirname, "surat-tugas.docx"),
    "binary"
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });
  doc.render({
    surat1,
    noSurat: surat1.noSurat,
    dsrTugas: surat1.dsrTugas,
    namaKecamatan: surat1.namaKecamatan,
    namaDesa: surat1.namaDesa,
    tgl: formattedDate,
    namaDitugaskan: surat1.namaDitugaskan,
    niap: surat1.niap,
    jabatan: surat1.jabatan,
    namaDitugaskan2: surat1.namaDitugaskan2,
    niap2: surat1.niap2,
    jabatan2: surat1.jabatan2,
    tujuan: surat1.tujuan,
    tujuan2: surat1.tujuan,
    namaKades: surat1.namaKades,
    namaDesaKop: surat1.namaDesa.toUpperCase(),
    namaKecamatanKop: surat1.namaKecamatan.toUpperCase(),
    alamat: surat1.alamat
  });
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  res.setHeader('Content-Disposition', `attachment; filename=SuratTugas-${surat1.namaDesa}-${surat1.tgl}.docx`); 
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
  res.send(buf);
});

// Menghapus surat domain di arsip
app.delete('/surat-domain', (req,res) =>{
  Surat1.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat domain berhasil dihapus!');
    res.redirect('/arsip');
  });
});

// Menghapus surat ganti admin di arsip
app.delete('/surat-ganti-admin', (req,res) =>{
  Surat2.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat ganti admin berhasil dihapus!');
    res.redirect('/arsip-adm');
  });
});

// Menghapus surat kuasa di arsip
app.delete('/surat-kuasa', (req,res) =>{
  Surat3.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat kuasa berhasil dihapus!');
    res.redirect('/arsip-kuasa');
  });
});

// Menghapus surat tugas di arsip
app.delete('/surat-tugas', (req,res) =>{
  Surat4.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat kuasa berhasil dihapus!');
    res.redirect('/arsip-tugas');
  });
});

// Form ubah data surat domain
app.get('/surat-domain/:_id', async (req, res) => {
  const surat1 = await Surat1.findOne({_id: req.params._id});
  res.render('editSuratDomain', {
    tittle : 'Form Ubah Data Surat Domain',
    layout : 'layouts/main-layout',
    msg: req.flash('msg'),
    surat1,
  })
});

// Proses ubah data Surat Domain
app.put('/surat-domain',(req ,res) => {
  Surat1.updateOne(
    {_id: req.body._id},
    {
      $set: {
        noSurat: req.body.noSurat,
        lampiran: req.body.lampiran,
        namaDesa: req.body.namaDesa,
        tgl: req.body.tgl,
        namaPengurusWeb: req.body.namaPengurusWeb,
        noHP: req.body.noHP,
        namaKades: req.body.namaKades,
        namaKecamatan: req.body.namaKecamatan,
        alamat: req.body.alamat,
      },
    }
  ).then((result) => {
    req.flash('msg', 'Data surat domain berhasil diubah!');
    res.redirect('/arsip');
  })
});

// Form ubah data surat ganti admin
app.get('/surat-adm/:_id', async (req, res) => {
  const surat1 = await Surat2.findOne({_id: req.params._id});
  res.render('editSuratGantiAdmin', {
    tittle : 'Form Ubah Data Surat Ganti Admin',
    layout : 'layouts/main-layout',
    msg: req.flash('msg'),
    surat1,
  })
});

// Proses ubah data Surat Ganti Admin
app.put('/surat-adm',(req ,res) => {
  Surat2.updateOne(
    {_id: req.body._id},
    {
      $set: {
        noSurat: req.body.noSurat,
        lampiran: req.body.lampiran,
        namaDesa: req.body.namaDesa,
        tgl: req.body.tgl,
        namaAdmin: req.body.namaAdmin,
        nik: req.body.nik,
        jabatan: req.body.jabatan,
        noHP: req.body.noHP,
        namaKades: req.body.namaKades,
        namaKecamatan: req.body.namaKecamatan,
        alamat: req.body.alamat,
      },
    }
  ).then((result) => {
    req.flash('msg', 'Data surat ganti admin berhasil diubah!');
    res.redirect('/arsip-adm');
  })
});

// Form ubah data surat kuasa
app.get('/surat-kuasa/:_id', async (req, res) => {
  const surat1 = await Surat3.findOne({_id: req.params._id});
  res.render('editSuratKuasa', {
    tittle : 'Form Ubah Data Surat Kuasa',
    layout : 'layouts/main-layout',
    msg: req.flash('msg'),
    surat1,
  })
});

// Proses ubah data Surat Kuasa
app.put('/surat-kuasa',(req ,res) => {
  Surat3.updateOne(
    {_id: req.body._id},
    {
      $set: {
        noSurat: req.body.noSurat,
        dsrTugas: req.body.dsrTugas,
        namaDesa: req.body.namaDesa,
        nip: req.body.nip,
        jabatan: req.body.jabatan,
        tujuan: req.body.tujuan,
        tgl: req.body.tgl,
        namaKades: req.body.namaKades,
        namaKecamatan: req.body.namaKecamatan,
        alamat: req.body.alamat,
      },
    }
  ).then((result) => {
    req.flash('msg', 'Data surat kuasa berhasil diubah!');
    res.redirect('/arsip-kuasa');
  })
});

// Form ubah data surat tugas
app.get('/surat-tugas/:_id', async (req, res) => {
  const surat1 = await Surat4.findOne({_id: req.params._id});
  res.render('editSuratTugas', {
    tittle : 'Form Ubah Data Surat Kuasa',
    layout : 'layouts/main-layout',
    msg: req.flash('msg'),
    surat1,
  })
});

// Proses ubah data Surat Kuasa
app.put('/surat-tugas',(req ,res) => {
  Surat4.updateOne(
    {_id: req.body._id},
    {
      $set: {
        noSurat: req.body.noSurat,
        dsrTugas: req.body.dsrTugas,
        namaKecamatan: req.body.namaKecamatan,
        namaDesa: req.body.namaDesa,
        tgl: req.body.tgl,
        namaDitugaskan: req.body.namaDitugaskan,
        niap: req.body.niap,
        jabatan: req.body.jabatan,
        namaDitugaskan2: req.body.namaDitugaskan2,
        niap2: req.body.niap2,
        jabatan2: req.body.jabatan2,
        tujuan: req.body.tujuan,
        tujuan2: req.body.tujuan,
        namaKades: req.body.namaKades,
        namaDesaKop: req.body.namaDesa,
        namaKecamatanKop: req.body.namaKecamatan,
        alamat: req.body.alamat
      },
    }
  ).then((result) => {
    req.flash('msg', 'Data surat tugas berhasil diubah!');
    res.redirect('/arsip-tugas');
  })
});

// Proses upload data surat domain
app.post('/upload1', (req,res)=>{
  // Storage Surat Domain
  const Storage1 = multer.diskStorage({
    destination:`public/uploads/Surat-domain`,
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    },
  });
  const upload1 = multer({
    storage: Storage1
  }).single('upload-file');
  upload1(req,res,(err)=>{
      if(err){
          console.log(err)
      }
      else{
          const newFile = new fileSurat1({
              name: req.body.name,
              image: {
                  data: req.file.filename,
                  contentType: req.file.mimetype
              },
              path: `${req.file.destination}/${req.file.filename}`
          });
          newFile.save()
          .then(res.redirect('/arsip-upload'))
          .catch(err=>console.log(err))
      }
  })
});

// Proses upload data surat ganti admin
app.post('/upload2', (req,res)=>{
  // Storage Surat Domain
  const Storage2 = multer.diskStorage({
    destination:`public/uploads/Surat-ganti-admin`,
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    },
  });
  const upload2 = multer({
    storage: Storage2
  }).single('upload-file')
  upload2(req,res,(err)=>{
      if(err){
          console.log(err)
      }
      else{
          const newFile = new fileSurat2({
              name: req.body.name,
              image: {
                  data: req.file.filename,
                  contentType: req.file.mimetype
              },
              path: `${req.file.destination}/${req.file.filename}`
          });
          newFile.save()
          .then(res.redirect('/arsip-adm-upload'))
          .catch(err=>console.log(err))
      }
  })
});

// Proses upload data surat kuasa
app.post('/upload3', (req,res)=>{
  // Storage Surat Kuasa
  const Storage3 = multer.diskStorage({
    destination:`public/uploads/Surat-Kuasa`,
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    },
  });
  const upload3 = multer({
    storage: Storage3
  }).single('upload-file')
  upload3(req,res,(err)=>{
      if(err){
          console.log(err)
      }
      else{
          const newFile = new fileSurat3({
              name: req.body.name,
              image: {
                  data: req.file.filename,
                  contentType: req.file.mimetype
              },
              path: `${req.file.destination}/${req.file.filename}`
          });
          newFile.save()
          .then(res.redirect('/arsip-kuasa-upload'))
          .catch(err=>console.log(err))
      }
  })
});

// Proses upload data surat tugas
app.post('/upload4', (req,res)=>{
  // Storage Surat Tugas
  const Storage4 = multer.diskStorage({
    destination:`public/uploads/Surat-Tugas`,
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    },
  });
  const upload4 = multer({
    storage: Storage4
  }).single('upload-file')
  upload4(req,res,(err)=>{
      if(err){
          console.log(err)
      }
      else{
          const newFile = new fileSurat4({
              name: req.body.name,
              image: {
                  data: req.file.filename,
                  contentType: req.file.mimetype
              },
              path: `${req.file.destination}/${req.file.filename}`
          });
          newFile.save()
          .then(res.redirect('/arsip-tugas-upload'))
          .catch(err=>console.log(err))
      }
  })
});

// Proses download surat domain yang sudah diupload
app.get('/downloadUpl/:_id', async (req,res) =>{
  const data = await fileSurat1.findOne({_id: req.params._id});
  res.download(data.path)
});

// Halaman Upload Surat Domain
app.get('/upload', async (req, res) => {
  res.render('uploadSuratDomain', { 
    layout : 'layouts/upload-layout',
    msg: req.flash('msg'),
  });
});

// Halaman Upload Surat Ganti Admin
app.get('/upload/surat-admin', async (req, res) => {
  res.render('uploadSuratGantiAdmin', { 
    layout : 'layouts/upload-layout',
    msg: req.flash('msg'),
  });
});

// Halaman Upload Surat Kuasa
app.get('/upload/surat-kuasa', async (req, res) => {
  res.render('uploadSuratKuasa', { 
    layout : 'layouts/upload-layout',
    msg: req.flash('msg'),
  });
});

// Halaman Upload Surat tugas
app.get('/upload/surat-tugas', async (req, res) => {
  res.render('uploadSuratTugas', { 
    layout : 'layouts/upload-layout',
    msg: req.flash('msg'),
  });
});

// Halaman Arsip Surat Domain yang diupload
app.get('/arsip-upload', async (req, res) => {
  const surat1 = await fileSurat1.find();
  const inputDate = new Date(surat1.createdAt);
  const formattedDate = formatTgl(inputDate);
  res.render('upload-arsip', { 
    layout : 'layouts/arsip-layout-upload',
    msg: req.flash('msg'),
    judul: 'Domain',
    jenis: 'surat-domain',
    formattedDate,
    surat1,
  });
});

// Halaman Arsip Surat Ganti Admin yang diupload
app.get('/arsip-adm-upload', async (req, res) => {
  const surat1 = await fileSurat2.find();
  res.render('upload-arsip', { 
    layout : 'layouts/arsip-layout-upload',
    msg: req.flash('msg'),
    judul: 'Ganti Admin',
    jenis: 'surat-admin',
    surat1,
  });
});

// Halaman Arsip Surat Kuasa yang di upload
app.get('/arsip-kuasa-upload', async (req, res) => {
  const surat1 = await fileSurat3.find();
  res.render('upload-arsip', { 
    layout : 'layouts/arsip-layout-upload',
    msg: req.flash('msg'),
    judul: 'Kuasa',
    jenis: 'surat-kuasa',
    surat1,
  });
});

// Halaman Arsip Surat Tugas yang di upload
app.get('/arsip-tugas-upload', async (req, res) => {
  const surat1 = await fileSurat4.find();
  res.render('upload-arsip', { 
    layout : 'layouts/arsip-layout-upload',
    msg: req.flash('msg'),
    judul: 'Tugas',
    jenis: 'surat-tugas',
    surat1,
  });
});

// Download Surat Domain yang sudah diupload
app.get('/download/surat-domain/:_id', async (req,res) =>{
  const data = await fileSurat1.findOne({_id: req.params._id});
  res.download(data.path)
});

// Download Surat Ganti Admin yang sudah diupload
app.get('/download/surat-admin/:_id', async (req,res) =>{
  const data = await fileSurat2.findOne({_id: req.params._id});
  res.download(data.path)
});

// Download Surat Kuasa yang sudah diupload
app.get('/download/surat-kuasa/:_id', async (req,res) =>{
  const data = await fileSurat3.findOne({_id: req.params._id});
  res.download(data.path)
});

// Download Surat Tugas yang sudah diupload
app.get('/download/surat-tugas/:_id', async (req,res) =>{
  const data = await fileSurat4.findOne({_id: req.params._id});
  res.download(data.path)
});

// Menghapus surat domain di arsip upload
app.delete('/upload/surat-domain', (req,res) =>{
  fs.unlink(req.body.path ,(err => {
    if (err) console.log(err);
    else {
      console.log("File Sudah dihapus");
    }
  }));
  fileSurat1.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat domain berhasil dihapus!');
    res.redirect('/arsip-upload');
  });
});

// Menghapus surat admin di arsip upload
app.delete('/upload/surat-admin', (req,res) =>{
  fs.unlink(req.body.path ,(err => {
    if (err) console.log(err);
    else {
      console.log("File Sudah dihapus");
    }
  }));
  fileSurat2.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat Ganti Admin berhasil dihapus!');
    res.redirect('/arsip-adm-upload');
  });
});

// Menghapus surat domain di arsip upload
app.delete('/upload/surat-kuasa', (req,res) =>{
  fs.unlink(req.body.path ,(err => {
    if (err) console.log(err);
    else {
      console.log("File Sudah dihapus");
    }
  }));
  fileSurat3.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat Kuasa berhasil dihapus!');
    res.redirect('/arsip-kuasa-upload');
  });
});

// Menghapus surat tugas di arsip upload
app.delete('/upload/surat-tugas', (req,res) =>{
  fs.unlink(req.body.path ,(err => {
    if (err) console.log(err);
    else {
      console.log("File Sudah dihapus");
    }
  }));
  fileSurat4.deleteOne({_id: req.body._id}).then((result) => {
    req.flash('msg', 'Surat Tugas berhasil dihapus!');
    res.redirect('/arsip-tugas-upload');
  });
});

app.listen(port, () => {
    console.log(`Suratdesa.com | listening at http://localhost:${port}`);
});