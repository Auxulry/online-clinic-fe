"use client"

import {useEffect, useState} from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {getStorage, setStorages} from "@/utils/storage";
import {useRouter} from "next/navigation";
import Joi from 'joi'
import {post} from "@/utils/interceptors";

export default function Register() {
  const router = useRouter();

  const validationSchema = Joi.object({
    name: Joi.string().required(),
    nik: Joi.string().required(),
    birthdate: Joi.date().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    gender: Joi.number().valid(0, 1).required(),
    password: Joi.string().required(),
  });

  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    birthdate: new Date(),
    address: "",
    phone: "",
    email: "",
    password: "",
    gender: 0, // Default to male
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const storage = getStorage('_clinic_token');
    if (storage != null)
      router.push('/');
  }, []);

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birthdate: date,
    });
  };

  const handleGenderChange = (e) => {
    setFormData({
      ...formData,
      gender: parseInt(e.target.value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const { error } = validationSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
    } else {
      post('authentication/register', formData).then((res) => {
        setStorages([
          { name: '_clinic_token', value: res?.data?.data?.accessToken }
        ])
        router.push('/')
        setFormData({
          name: "",
          nik: "",
          birthdate: new Date(),
          address: "",
          phone: "",
          email: "",
          password: "",
          gender: 0,
        })
      }).catch((err) => {
        if (err?.data?.code !== 400) {
          setIsError(true)
          setMessage(err?.data?.status === 'Internal Sever Error' ? 'Kendala pada server.' : err?.data?.status)
        }
      })
    }
  };
  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white relative">
      <div className='text-2xl font-bold text-center'>
        Form Pendaftaran
      </div>
      {message !== '' && isError && (
        <span className="text-xs text-center text-red-500">{message}</span>
      )}
      <form onSubmit={handleSubmit} className='w-full'>
        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="Nama Lengkap"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name}</span>
          )}
        </label>

        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="NIK"
            type="text"
            name="nik"
            value={formData.nik}
            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
          />
          {errors.nik && (
            <span className="text-xs text-red-500">{errors.nik}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-1 mx-auto">
          <DatePicker
            selected={formData.birthdate}
            onChange={handleDateChange}
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.birthdate ? "border-red-500" : ""}`}
            placeholderText="Tanggal Lahir"
          />
          {errors.birthdate && (
            <span className="text-xs text-red-500">{errors.birthdate}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="Alamat"
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          {errors.address && (
            <span className="text-xs text-red-500">{errors.address}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="No Telp"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && (
            <span className="text-xs text-red-500">{errors.phone}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password}</span>
          )}
        </label>
        <fieldset className="flex flex-row items-center justify-between w-4/5 mb-4 mx-auto">
          <input
            id="male"
            className="peer/male accent-black"
            type="radio"
            name="gender"
            value="0"
            checked={formData.gender === 0}
            onChange={handleGenderChange}
          />
          <label htmlFor="male" className="peer-checked/male:text-slate-900">Laki-Laki</label>

          <input
            id="female"
            className="peer/female accent-black"
            type="radio"
            name="gender"
            value="1"
            checked={formData.gender === 1}
            onChange={handleGenderChange}
          />
          <label htmlFor="female" className="peer-checked/female:text-slate-900">Perempuan</label>
        </fieldset>
        <div className='relative block w-4/5 mx-auto'>
          <button type="submit" className="mx-auto mb-4 w-full bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
            Daftar
          </button>
        </div>
      </form>
      <p className='text-xs w-4/5 text-center'>
        Sudah memiliki akun? <a className='underline font-bold' href='#'>Masuk</a>
      </p>
    </main>
  )
}
