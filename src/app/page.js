"use client"

import {BsPerson} from "react-icons/bs";
import {LiaSignOutAltSolid} from "react-icons/lia";
import {useEffect, useState} from "react";
import {IoMdTime} from "react-icons/io";
import {HiOutlineCalendar} from "react-icons/hi";
import {clearStorages, getStorage} from "@/utils/storage";
import {useRouter} from "next/navigation";
import {get} from "@/utils/interceptors";
import dayjs from "dayjs";

export default function Home() {
  const [open, setIsOpen] = useState(false)
  const [data, setData] = useState()
  const [user, setUser] = useState()
  const [isEmpty, setIsEmpty] = useState(false)

  const router = useRouter()

  const handleLogout = () => {
    clearStorages(['_clinic_token'])
    router.push('/auth/login')
  }

  const handleRoute = () => {
    router.push('/queue')
  }

  useEffect(() => {
    const storage = getStorage('_clinic_token');
    if (storage == null)
      router.push('/auth/login')
  }, []);

  useEffect(() => {
    get('authentication/me').then((res) => {
      setUser(res?.data?.data)
    })
    get('queue').then((res) => {
      if (typeof res?.data === 'undefined') {
        setData(res?.data?.data)
      } else {
        setIsEmpty(true)
      }
    })
  }, [])

  return (
    <main className={`max-w-screen-sm mx-auto h-screen flex flex-col justify-between items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white relative`}>
      <div className='text-lg font-bold text-left w-full'>
        Selamat Datang!, Halo {user?.name}
      </div>
      <div className='absolute top-4 right-4 flex flex-col rounded-lg bg-black p-2 gap-4 w-[80px]'>
        <div className='flex flex-col justify-center items-center cursor-pointer' onClick={() => setIsOpen(!open)}>
          <BsPerson className='text-white' size={24} />
          <div className='menu-item truncate'>{user?.name}</div>
        </div>
        {open && (
          <div className='flex flex-col justify-center items-center cursor-pointer' onClick={handleLogout}>
            <LiaSignOutAltSolid className='text-white' size={24} />
            <div className='menu-item'>logout</div>
          </div>
        )}
      </div>
      {user?.is_admin && (
        <button type="button" onClick={handleRoute} className="mx-auto w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
          List Poli
        </button>
      )}
      {!user?.is_admin && (
        <>
          <button type="button" onClick={handleRoute} className="mx-auto w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
            Daftar Antrean
          </button>
          <div className='flex flex-col gap-4 p-2 w-full'>
            <div className='text-lg w-full text-center'>Antrean Anda</div>
            {!isEmpty && (
              <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-2'>
                  <div className="mx-auto bg-[url('/online-clinic-sample-1.png')] bg-center bg-contain bg-no-repeat w-[16px] h-[16px]"></div>
                  <div className='text-sm'>{data?.poli?.name}</div>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <HiOutlineCalendar size={16} />
                  <div className='text-sm'>{dayjs(data?.date).format('MM/DD/YYYY')}</div>
                </div>
              </div>
            )}
            <div className='flex flex-col gap-4 queue w-full bg-black text-white'>
              {isEmpty && (
                <div className='text-md font-bold text-center border-dashed border-white border-b-2 w-full py-2'>Belum ada antrean</div>
              )}
              {!isEmpty && (
                <div className='font-bold text-center border-dashed border-white border-b-2 w-full py-2 flex flex-col gap-2'>
                  <div className='text-md'>No Antrean</div>
                  <div className='text-xl'>{parseInt(data?.number) < 10 ? '0'+data?.number : data?.number}</div>
                </div>
              )}
              <div className='flex flex-col w-full gap-2 p-2'>
                <div className='text-md font-bold'>Klinik Pratama Al-Ikhlas</div>
                <div className='text-sm py-2'>Jl. Letkol G.A. Manulang No.141, Padalarang</div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
