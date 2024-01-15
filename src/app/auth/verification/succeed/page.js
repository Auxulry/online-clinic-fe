import {MdMail, MdRemoveRedEye} from "react-icons/md";

export default function Succeed() {
  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white relative">
      <div className="mx-auto bg-[url('/online-clinic-verification-success.png')] bg-center bg-contain bg-no-repeat w-[280px] h-[200px] rounded-3xl"></div>
      <div className='text-md text-center mt-4 mb-8'>
        Selamat! akun mu sudah diverifikasi dan sudah bisa digunakan!
      </div>
      <button type="button" className="mx-auto mb-4 w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
        Masuk
      </button>
    </main>
  )
}
