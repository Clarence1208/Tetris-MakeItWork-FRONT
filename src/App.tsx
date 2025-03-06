import './App.css'
import Board from './components/Board'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
    return (
        <div className="min-h-screen bg-base-100" data-theme="cupcake">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-center">Tetris Kanban</h1>
                    <p className="text-center text-base-content/70 mt-2">
                        Organize your tasks with Tetris blocks on a 10x12 grid
                    </p>
                </header>
                <main className="flex justify-center">
                    <ErrorBoundary>
                        <Board/>
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    )
}

export default App
