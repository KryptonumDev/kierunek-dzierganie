import ControlPanel from '@/components/_dashboard/ControlPanel';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='dashboard-wrapper'>
      <ControlPanel />
      {children}
    </div>
  );
}
