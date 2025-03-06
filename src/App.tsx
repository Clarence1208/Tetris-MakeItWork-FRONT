import './App.css'
import AppRouter from './routes/PrivateRoute'
import Header from "./Header.tsx";

function App() {
  return (<>
    <Header />
    <AppRouter></AppRouter>
  </>
  )
}

export default App
