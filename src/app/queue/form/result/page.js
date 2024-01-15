"use client"


import {getStorage} from "@/utils/storage";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {get} from "@/utils/interceptors";
import dayjs from 'dayjs';
import 'dayjs/locale/id';

export default function Result() {
  const router = useRouter()
  const [data, setData] = useState()
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    const storage = getStorage('_clinic_token');
    if (storage == null)
      router.push('/auth/login');
  }, []);

  useEffect(() => {
    get('queue').then((res) => {
      if (typeof res?.data?.data.length === 'undefined') {
        setData(res?.data?.data)
      } else {
        setIsEmpty(true)
      }
    })
  }, [])

  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white">
      <div className='text-2xl font-bold text-center mb-16'>Antrean</div>
      {!isEmpty && (
        <>
          <div className='flex flex-col w-4/5 text-center gap-2 mb-4'>
            <div className='text-sm'>{dayjs(data?.date).locale('id').format('dddd, DD MMMM YYYY')}</div>
            <div className='text-sm font-bold'>{data?.poli?.name}</div>
          </div>
          <div className='text-lg mb-2'>Anda mendapatkan antrean no urut</div>
          <div className='py-4 px-8 bg-slate-300 rounded text-xl font-bold mb-16'>
            {parseInt(data?.number) < 10 ? '0'+data?.number : data?.number}
          </div>
        </>
      )}
      {isEmpty && (
        <div className='flex flex-col w-4/5 text-center gap-2 mb-4'>
          <div className='text-sm'>Anda belum mengambil antrean</div>
        </div>
      )}
      <button type="button" onClick={() => router.push('/')} className="mx-auto w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
        Halaman Utama
      </button>
    </main>
  )
}
