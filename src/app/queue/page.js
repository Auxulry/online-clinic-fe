"use client"
import {IoArrowBackOutline} from "react-icons/io5";
import {useRouter} from "next/navigation";
import {getStorage} from "@/utils/storage";
import {useEffect, useState} from "react";
import {get} from "@/utils/interceptors";

export default function Queue() {
  const router = useRouter()

  const [polis, setPolis] = useState([])
  const [user, setUser] = useState()

  useEffect(() => {
    const storage = getStorage('_clinic_token');
    if (storage == null)
      router.push('/auth/login')
  }, [])

  useEffect(() => {
    get('polis?page=1&itemPerPage=20000').then((res) => {
      setPolis(res?.data?.data?.items)
    })
    get('authentication/me').then((res) => {
      setUser(res?.data?.data)
    })
  }, []);

  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white relative">
      <div className='absolute left-4 top-12 flex flex-row gap-2 items-center' onClick={() => router.push('/')}>
        <IoArrowBackOutline />
        <div className='text-sm font-bold text-left'>Kembali</div>
      </div>
      <div className='text-2xl font-bold text-center mb-4'>List Poli</div>
      {polis.length === 0 && (
        <div className='text-lg text-center font-bold w-4/5'>Tidak ada Poli</div>
      )}
      {polis.length > 0 && polis.map((item) => (
        <div className='flex flex-col w-4/5 gap-2 mb-1' key={item?.id}>
          <div className='flex flex-row gap-2 items-center w-full border-slate-300 hover:bg-slate-300 border-2 rounded-lg px-2 py-4'>
            <div
              className={`w-[32px] h-[32px]`}
               style={{
                 background: `url('${item?.icon}')`,
                 backgroundPosition: 'center',
                 backgroundSize: 'contain',
                 backgroundRepeat: 'no-repeat'
               }}
            ></div>
            <div className='text-md font-bold'>{item?.name}</div>
          </div>
        </div>
      ))}
      {!user?.is_admin && (
        <button type="button" onClick={() => router.push('/queue/form')} className="mx-auto w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
          Daftar Antrean
        </button>
      )}
      {user?.is_admin && (
        <button type="button" onClick={() => router.push('/queue/poli')} className="mx-auto w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
          Buat Poli
        </button>
      )}
    </main>
  )
}
