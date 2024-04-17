import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FilterPage from './features/filter-table/components/FilterPage';

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<FilterPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
