"use client"

import {useEffect, useState} from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {getStorage, setStorages} from "@/utils/storage";
import {useRouter} from "next/navigation";
import Joi from 'joi'
import {post} from "@/utils/interceptors";
import Link from "next/link";
import Form from "@/app/queue/form/page";

export default function Register() {
  const router = useRouter();

  const validationSchema = Joi.object({
    name: Joi.string().required(),
    doctor_name: Joi.string().required(),
  }).unknown(true);

  const [formData, setFormData] = useState({
    name: "",
    doctor_name: "",
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorFile, setErrorFile] = useState('')

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
      if (formData.files.length !== 0) {
        const payload = new FormData()
        payload.append('name', formData.name)
        payload.append('doctor_name', formData.doctor_name)
        payload.append('image', formData.files)

        post('polis', payload).then((res) => {
          setFormData({
            name: "",
            doctor_name: "",
            files: []
          })
          router.push('/queue')
        }).catch((err) => {
          if (err?.data?.code !== 400) {
            setIsError(true)
            setMessage(err?.data?.status === 'Internal Sever Error' ? 'Kendala pada server.' : err?.data?.status)
          }
        })
      } else {
        setErrorFile('icon is required.')
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const icon = {
        size: file.size,
        type: file.type,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        files: file,
      }));
    }
  };

  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white relative">
      <div className='text-2xl font-bold text-center'>
        Form Poli
      </div>
      {message !== '' && isError && (
        <span className="text-xs text-center text-red-500">{message}</span>
      )}
      <form onSubmit={handleSubmit} className='w-full'>
        <label className="relative block w-4/5 mb-1 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.fullName ? "border-red-500" : ""}`}
            placeholder="Nama Poli"
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
            placeholder="Nama Doctor"
            type="text"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
          />
          {errors.doctor_name && (
            <span className="text-xs text-red-500">{errors.doctor_name}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-2 mt-4 mx-auto">
          <input
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full py-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.icon ? "border-red-500" : ""}`}
            type="file"
            name="files"
            accept={'image/*'}
            onChange={(e) => handleFileChange(e)}
          />
          {errorFile && (
            <span className="text-xs text-red-500">{errorFile}</span>
          )}
        </label>

        {/* Display the list of uploaded files */}
        {formData.files.length > 0 && (
          <div className="relative block w-4/5 mb-4 mt-4 mx-auto">
            <p className="text-sm font-semibold">Uploaded Files:</p>
            <ul>
              {formData.files.map((file, index) => (
                <li key={index}>
                  {`File ${index + 1}: Type - ${file.type}, Size - ${file.size} bytes`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className='relative block w-4/5 mx-auto'>
          <button type="submit" className="mx-auto mb-4 w-full bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
            Buat
          </button>
        </div>
      </form>
    </main>
  )
}
