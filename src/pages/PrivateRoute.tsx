import { Navigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Layout from './Layout';

const PrivateRoute = () => {
  const { session } = UserAuth();
  const location = useLocation();

  console.log(location);

  if (session === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {session ? (
        <>
          <Layout />
        </>
      ) : (
        <Navigate to={'/signin'} replace state={{ from: location }} />
      )}
    </>
  );
};

export default PrivateRoute;
