import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import AddFile from './AddFile';
import Detail from './Detail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/addFile' element={<AddFile />}></Route>
        <Route path='/detail/:id' element={<Detail />}></Route>
        <Route path='/*' element={<Navigate to='/'></Navigate>}></Route>  
      </Routes>
    </Router>
  );
}

export default App;
