import logo from '@/assets/logo.svg'
import logoPicture from '@/assets/layout-picture.webp'
import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://bytebase.com" target="_blank">
          <img src={logo} className="logo bytebase" alt="Bytebase logo" />
        </a>
        <img src={logoPicture} className="logo bytebase-picture" alt="Bytebase layout picture" />
      </div>
    </>
  )
}

export default App
