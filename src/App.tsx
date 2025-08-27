import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Nomatch from './pages/Nomatch';
import Signin from './pages/Signin';
import SignUp from './pages/Signup';
import PrivateRoute from './pages/PrivateRoute';
import Sample from './pages/Sample';
import XrayPage from './pages/sideBarLists/modalities/XrayPage';
import CTPage from './pages/sideBarLists/modalities/CTPage';
import MRIPage from './pages/sideBarLists/modalities/MRIPage';
import AngioPage from './pages/sideBarLists/modalities/AngioPage';
import FluoroscopyPage from './pages/sideBarLists/modalities/FluoroscopyPage';
import RIPage from './pages/sideBarLists/modalities/RIPage';
import RadiotherapyPage from './pages/sideBarLists/modalities/RadiotherapyPage';
import FAQ from './pages/sideBarLists/FAQ';
// import { router } from './router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path='/'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        /> */}
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/sample' element={<Sample />} />
          <Route path='/Xray_page' element={<XrayPage />} />
          <Route path='/CT_page' element={<CTPage />} />
          <Route path='/MRI_page' element={<MRIPage />} />
          <Route path='/Angio_page' element={<AngioPage />} />
          <Route path='/Fluoroscopy_page' element={<FluoroscopyPage />} />
          <Route path='/RI_page' element={<RIPage />} />
          <Route path='/Radiotherapy_page' element={<RadiotherapyPage />} />
          <Route path='/FAQ_page' element={<FAQ />} />
        </Route>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='*' element={<Nomatch />} />
      </Routes>
    </BrowserRouter>
    // <>
    //   <h1>React Supabase App</h1>

    //   <RouterProvider router={router} />
    // </>
  );
}

export default App;
