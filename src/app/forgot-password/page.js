import {MdMail, MdRemoveRedEye} from "react-icons/md";

export default function Page() {
  return (
    <main className="max-w-screen-sm mx-auto h-screen flex flex-col items-center gap-4 pt-64 pb-4 pr-8 pl-8 bg-white">
      <div className='text-2xl font-bold text-center'>
        Forgot Password
      </div>
      <label className="relative block w-4/5 mb-16 mt-4 mx-auto">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <MdMail className='h-5 w-5 fill-slate-300' />
        </span>
        <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Search for anything..." type="text" name="search"/>
      </label>
      <button type="button" className="mx-auto w-4/5 bg-slate-900 hover:bg-slate-950 focus:outline-none focus:ring focus:ring-slate-700 active:bg-slate-950 px-5 py-2 text-sm leading-5 rounded font-semibold text-white">
        Forgot Password
      </button>
    </main>
  )
}
