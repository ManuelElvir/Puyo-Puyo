import './App.css'
import Board from './components/Board'

function App() {

  return (
    <div  className='container'>
      <Board speed={1} difficulty='medium' />
    </div>
  )
}

export default App
