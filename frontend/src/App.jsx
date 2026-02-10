import { Outlet } from "react-router-dom";

import './App.css'
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className='text-6xl font-bold'>
      <NavBar/>
      <Outlet />
    </div>
  )
}

export default App
