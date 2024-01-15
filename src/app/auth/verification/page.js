import {MdMail, MdRemoveRedEye} from "react-icons/md";

export default function Verification() {
  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-32 pb-4 pr-8 pl-8 bg-white relative">
      <div className="mx-auto bg-[url('/online-clinic-verification.png')] bg-center bg-contain bg-no-repeat w-[280px] h-[200px] rounded-3xl"></div>
      <div className='text-2xl text-center mt-4 mb-8'>
        Klik tombol dibawah untuk melakukan <strong>Verifikasi</strong> akun mu
      </div>
      <button type="button" className="mx-auto mb-4 w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
        Verifikasi
      </button>
    </main>
  )
}
