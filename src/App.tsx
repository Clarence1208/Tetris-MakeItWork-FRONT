import './App.css'
import AppRouter from './routes/PrivateRoute'
import Header from "./components/Header.tsx";

function App() {
    return (<>
            <Header />
            <AppRouter></AppRouter>
        </>
    )
}

export default App