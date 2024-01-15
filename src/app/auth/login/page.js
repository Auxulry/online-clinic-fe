"use client"

import {MdMail, MdPanoramaFishEye, MdRemoveRedEye} from "react-icons/md";
import Joi from "joi";
import {useEffect, useState} from "react";
import {post} from "@/utils/interceptors";
import {getStorage, setStorages} from "@/utils/storage";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function Login() {
  const validationSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const storage = getStorage('_clinic_token');
    if (storage != null)
      router.push('/')
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      setErrors({});
      // Your form submission logic goes here
      post('authentication/login', formData).then((res) => {
        setStorages([
          { name: '_clinic_token', value: res?.data?.data?.accessToken }
        ])
        router.push('/')
        setFormData({
          email: "",
          password: "",
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
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-16 pb-4 pr-8 pl-8 bg-white relative">
      <div className='text-2xl font-bold text-center'>
        Klinik Pratama Al - Ikhlas
      </div>
      <div className="mx-auto bg-[url('/online-clinic-login.png')] bg-center bg-contain bg-no-repeat w-[280px] h-[200px] rounded-3xl"></div>
      <div className='text-2xl text-center mt-4'>
        Daftar Pelayanan Kesehatan <strong>Mudah</strong> dan <strong>Praktis</strong>
      </div>
      {message !== '' && isError && (
        <span className="text-xs text-center text-red-500">{message}</span>
      )}
      <form onSubmit={handleSubmit} className="w-full">
        <label className="relative block w-4/5 mb-2 mt-4 mx-auto">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <MdMail className='h-5 w-5 fill-slate-300' />
        </span>
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="Email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-4 mx-auto">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          {!showPassword && (
            <MdRemoveRedEye className='h-5 w-5 fill-slate-300' onClick={() => setShowPassword(true)} />
          )}
          {showPassword && (
            <MdPanoramaFishEye className='h-5 w-5 fill-slate-300' onClick={() => setShowPassword(false)} />
          )}
        </span>
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-9 pl-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password}</span>
          )}
        </label>
        <div className='relative block w-4/5 mx-auto'>
          <button type="submit" className="mx-auto mb-4 w-full bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
            Masuk
          </button>
        </div>
      </form>

      <p className='text-xs w-4/5 text-center'>
        Belum punya akun? &nbsp;
        <Link href={'/auth/register'} className='underline font-bold'>
          Register
        </Link>
      </p>
      <div className='absolute w-4/5 bottom-0 p-4 text-center text-sm'>Forgot Password?</div>
    </main>
  )
}
