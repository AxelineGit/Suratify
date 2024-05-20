const mongoose = require('mongoose');

// Surat Domain
const Surat1 = mongoose.model('Surat1',{
    noSurat: {
        type: String,
        required: true,
    },
    lampiran: {
        type: Number,
        required: true,
    },
    namaDesa: {
        type: String,
        required: true,
    },
    tgl: {
        type: String,
        required: true,
    },
    namaPengurusWeb: {
        type: String,
        required: true,
    },
    noHP: {
        type: Number,
        required: true,
    },
    namaKades: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    _id: { 
        type: mongoose.Types.ObjectId, 
        auto: true 
    },
    alamat:{
        type: String,
        required: true,
    },
    namaKecamatan:{
        type: String,
        required: true,
    },
});

// Surat Ganti Admin
const Surat2 = mongoose.model('Surat2',{
    noSurat: {
        type: String,
        required: true,
    },
    lampiran: {
        type: Number,
        required: true,
    },
    namaDesa: {
        type: String,
        required: true,
    },
    tgl: {
        type: String,
        required: true,
    },
    namaAdmin: {
        type: String,
        required: true,
    },
    nik: {
        type: Number,
        required: true,
    },
    jabatan: {
        type: String,
        required: true,
    },
    noHP: {
        type: Number,
        required: true,
    },
    namaKades: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    alamat:{
        type: String,
        required: true,
    },
    namaKecamatan:{
        type: String,
        required: true,
    },
});

// Surat Kuasa
const Surat3 = mongoose.model('Surat3',{
    noSurat: {
        type: String,
        required: true,
    },
    namaDesa: {
        type: String,
        required: true,
    },
    tgl: {
        type: String,
        required: true,
    },
    namaKades: {
        type: String,
        required: true,
    },
    nik: {
        type: Number,
        required: true,
    },
    namaKecamatan: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    alamat:{
        type: String,
        required: true,
    },
});

// Surat Tugas
const Surat4 = mongoose.model('Surat4',{
    noSurat: {
        type: String,
        required: true,
    },
    dsrTugas: {
        type: String,
        required: true,
    },
    namaDesa: {
        type: String,
        required: true,
    },
    namaDitugaskan: {
        type: String,
        required: true,
    },
    jabatan: {
        type: String,
        required: true,
    },
    niap:{
        type: Number,
        required: true,
    },
    namaDitugaskan2: {
        type: String,
        required: true,
    },
    jabatan2: {
        type: String,
        required: true,
    },
    niap2:{
        type: Number,
        required: true,
    },
    tujuan:{
        type: String,
        required: true,
    },
    tujuan2:{
        type: String,
        required: true,
    },
    tgl: {
        type: String,
        required: true,
    },
    namaKades: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    alamat:{
        type: String,
        required: true,
    },
    namaKecamatan:{
        type: String,
        required: true,
    },
});

// Upload Surat Domain
const fileSurat1 = mongoose.model('uploadsurat1',{
    name: {
        type: String,
        required: true
    },
    image:{
        data:Buffer,
        contentType: String
    },
    path: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Upload Surat Ganti Admin
const fileSurat2 = mongoose.model('uploadsurat2',{
    name: {
        type: String,
        required: true
    },
    image:{
        data:Buffer,
        contentType: String
    },
    path: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
// Upload Surat Kuasa
const fileSurat3 = mongoose.model('uploadsurat3',{
    name: {
        type: String,
        required: true
    },
    image:{
        data:Buffer,
        contentType: String
    },
    path: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
// Upload Surat Tugas
const fileSurat4 = mongoose.model('uploadsurat4',{
    name: {
        type: String,
        required: true
    },
    image:{
        data:Buffer,
        contentType: String
    },
    path: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = {Surat1, Surat2, Surat3, Surat4, fileSurat1, fileSurat2, fileSurat3, fileSurat4};