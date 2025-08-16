import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Nomatch from './pages/Nomatch';
import Signin from './pages/Signin';
import SignUp from './pages/Signup';
import PrivateRoute from './pages/PrivateRoute';
import Sample from './pages/Sample';
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
