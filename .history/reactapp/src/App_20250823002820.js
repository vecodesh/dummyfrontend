import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { SignUpPage } from './components/SignUpPage';
import { FolderDocs } from './components/FolderDocs';
const App=()=>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/sign' element={<SignUpPage/>}></Route>
                <Route path='/folderDocs/:id' element={<FolderDocs/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;