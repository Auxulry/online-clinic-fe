"use client"

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getStorage} from "@/utils/storage";
import {get, post} from "@/utils/interceptors";
import Joi from "joi";

export default function Form() {
  const router = useRouter();

  const [polis, setPolis] = useState([]);
  const [selectedPoli, setSelectedPoli] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const storage = getStorage('_clinic_token');
    if (storage == null)
      router.push('/auth/login');
  }, []);

  useEffect(() => {
    get('polis?page=1&itemPerPage=20000').then((res) => {
      setPolis(res?.data?.data?.items);
    });
  }, []);

  const validationSchema = Joi.object({
    poli: Joi.string().required().label("Poli"),
    date: Joi.date().required().label("Tanggal Lahir"),
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = { poli: selectedPoli, date: startDate };

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
      post('queue', {poli_id: formData.poli, date: formData.date}).then(() => {
        router.push('/queue/form/result')
        setSelectedPoli('')
        setStartDate(new Date())
      }).catch((err) => {
        if (err?.data?.code !== 400) {
          setIsError(true)
          setMessage(err?.data?.status === 'Internal Sever Error' ? 'Kendala pada server.' : err?.data?.status)
        }
      })
    }
  };

  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white">
      <div className='text-2xl font-bold text-center mb-4'>Form Antrean</div>
      {message !== '' && isError && (
        <span className="text-xs text-center text-red-500">{message}</span>
      )}
      <form onSubmit={handleSubmit} className='w-full'>
        <label className="relative block w-4/5 mb-4 mx-auto">
          <select
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.poli ? "border-red-500" : ""}`}
            name="search"
            value={selectedPoli}
            onChange={(e) => setSelectedPoli(e.target.value)}
          >
            <option value="" disabled selected>Pilih Poli</option>
            {polis.map((item) => (
              <option value={item?.id} key={item?.id}>{item?.name}</option>
            ))}
          </select>
          {errors.poli && (
            <span className="text-xs text-red-500">{errors.poli}</span>
          )}
        </label>
        <label className="relative block w-4/5 mb-32 mx-auto">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className={`placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.date ? "border-red-500" : ""}`}
            placeholderText="Tanggal Lahir"
          />
          {errors.date && (
            <span className="text-xs text-red-500">{errors.date}</span>
          )}
        </label>
        <div className='relative block w-4/5 mx-auto'>
          <button type="submit" className="mx-auto mb-4 w-full bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
