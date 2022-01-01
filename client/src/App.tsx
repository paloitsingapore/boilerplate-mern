import * as React from 'react';
import './App.scss';
import DefaultLayout from './layouts/DefaultLayout'
import Logs from './pages/Logs';
import Home from './pages/Home';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={Home()} />
          <Route path="/logs" element={Logs()} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
