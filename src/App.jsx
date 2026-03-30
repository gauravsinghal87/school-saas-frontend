import { lazy } from "react"
const AppRoutes = lazy(() => import("./routes/AppRoutes"));


function App() {

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
