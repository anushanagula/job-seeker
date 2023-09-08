import {Routes,Route} from "react-router-dom";
import Dashboard  from "./components/dashboard";
import Container from 'react-bootstrap/Container';
import Navigation  from "./components/navigation";
import LoginPage  from "./components/loginPage";

export default function App() {
  return(
    <Container fluid className="bg-white p-0">
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} exact></Route>
        <Route path="/login" element =  { <LoginPage /> }> </Route>
      </Routes>

    </Container>
  )
}
