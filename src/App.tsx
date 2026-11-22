import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Car as CarIcon } from 'lucide-react';
import { useGarage } from '@/hooks/useGarage';
import Dashboard from '@/pages/Dashboard';
import Cars from '@/pages/Cars';
import CarHistory from '@/pages/CarHistory';

const navItemCls = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-orange-500/15 text-orange-400'
      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
  }`;

function App() {
  const garage = useGarage();

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#1a1a1a] text-zinc-200">
        <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#1a1a1a]/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <NavLink to="/" className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <CarIcon size={19} className="text-white" />
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                Garage<span className="text-orange-400">Log</span>
              </span>
            </NavLink>
            <nav className="flex items-center gap-1.5">
              <NavLink to="/" end className={navItemCls}>
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Обзор</span>
              </NavLink>
              <NavLink to="/cars" className={navItemCls}>
                <CarIcon size={16} />
                <span className="hidden sm:inline">Мои автомобили</span>
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Routes>
            <Route
              path="/"
              element={<Dashboard cars={garage.cars} records={garage.records} addCar={garage.addCar} addRecord={garage.addRecord} deleteRecord={garage.deleteRecord} />}
            />
            <Route
              path="/cars"
              element={<Cars cars={garage.cars} records={garage.records} addCar={garage.addCar} deleteCar={garage.deleteCar} />}
            />
            <Route
              path="/cars/:carId"
              element={<CarHistory cars={garage.cars} records={garage.records} addRecord={garage.addRecord} deleteRecord={garage.deleteRecord} />}
            />
            <Route
              path="*"
              element={<Dashboard cars={garage.cars} records={garage.records} addCar={garage.addCar} addRecord={garage.addRecord} deleteRecord={garage.deleteRecord} />}
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
