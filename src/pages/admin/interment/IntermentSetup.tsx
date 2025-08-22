import { Outlet } from 'react-router-dom'

export default function IntermentSetup() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-2 p-4'>
      <Outlet />
    </div>
  )
}
