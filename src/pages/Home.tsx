import { UserAuth } from '../context/AuthContext';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { TasksProgress } from '../components/home/tasks-progress';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import type {
  ModalitiesType,
  OrganizationType,
} from '../../types/databaseTypes';
import { UserInfo } from '../context/UserContext';

const Home = () => {
  const [organizations, setOrganizations] = useState<OrganizationType[]>([]);
  const [modalities, setModalities] = useState<ModalitiesType[]>([]);
  const { session } = UserAuth();
  const { userInfo } = UserInfo();

  // console.log('session', session);
  // console.log('session.user.id', session?.user.id);
  // console.log(userInfo);

  useEffect(() => {
    getOrganizations();
    getModalities();
  }, []);

  const getOrganizations = async () => {
    const { data, error } = await supabase.from('organizations').select();
    if (data) {
      setOrganizations(data);
    } else {
      console.error(error);
    }
  };
  const getModalities = async () => {
    const { data, error } = await supabase.from('modalities').select();
    if (data) {
      setModalities(data);
      // console.log(data);
    } else {
      console.error(error);
    }
  };

  const room = [
    '51A撮影室',
    // '操作廊下',
    // 'IP室',
    // 'DEXA室',
    // 'マンモ6室',
    // 'マンモ予防C',
    // '51Aポータブル',
    // 'ERポータブル',
    // 'ER撮影室',
    // 'ER物品',
    // 'OP室ポータブル',
    // 'ICUポータブル',
    // '夜勤・休日確認',
  ];
  return (
    <>
      <Box>
        <Typography>Home</Typography>
        <Typography>Welcome, {session?.user.email} 様 !</Typography>

        <br />
        <ul>
          {organizations.map((organization) => (
            <li key={organization.id}>
              abc{organization.name},{organization.id}
            </li>
          ))}
        </ul>
        <br />
        <ul>
          {modalities.map((modality) => (
            <li key={modality.id}>
              {modality.id}:{modality.name}
            </li>
          ))}
        </ul>
        <br />
        <Typography>{userInfo?.name_kanji}</Typography>
        <Typography>{userInfo?.name_kana}</Typography>
        <Link href='../sample' variant='body2' sx={{ alignSelf: 'center' }}>
          Sample
        </Link>
      </Box>
      <Grid container spacing={3}>
        {room.map((room) => {
          return (
            <Grid
              size={{
                lg: 2,
                sm: 3,
                xs: 4,
              }}
              key={room}
            >
              <TasksProgress
                sx={{ minHeight: 120 }}
                roomName={room}
                value={0}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Home;

// <>
//   <Grid
//     size={{
//       lg: 8,
//       xs: 12,
//     }}
//   >
//     <Box bgcolor={'red'} sx={{ minHeight: 120 }} />
//   </Grid>
//   <Grid
//     size={{
//       lg: 4,
//       md: 6,
//       xs: 12,
//     }}
//   >
//     <Box bgcolor={'grey'} sx={{ minHeight: 120 }} />
//   </Grid>
//   <Grid
//     size={{
//       lg: 4,
//       md: 6,
//       xs: 12,
//     }}
//   >
//     {/* <LatestProducts
//           products={[
//             {
//               id: 'PRD-005',
//               name: 'Soja & Co. Eucalyptus',
//               image: '/assets/product-5.png',
//               updatedAt: dayjs()
//                 .subtract(18, 'minutes')
//                 .subtract(5, 'hour')
//                 .toDate(),
//             },
//             {
//               id: 'PRD-004',
//               name: 'Necessaire Body Lotion',
//               image: '/assets/product-4.png',
//               updatedAt: dayjs()
//                 .subtract(41, 'minutes')
//                 .subtract(3, 'hour')
//                 .toDate(),
//             },
//             {
//               id: 'PRD-003',
//               name: 'Ritual of Sakura',
//               image: '/assets/product-3.png',
//               updatedAt: dayjs()
//                 .subtract(5, 'minutes')
//                 .subtract(3, 'hour')
//                 .toDate(),
//             },
//             {
//               id: 'PRD-002',
//               name: 'Lancome Rouge',
//               image: '/assets/product-2.png',
//               updatedAt: dayjs()
//                 .subtract(23, 'minutes')
//                 .subtract(2, 'hour')
//                 .toDate(),
//             },
//             {
//               id: 'PRD-001',
//               name: 'Erbology Aloe Vera',
//               image: '/assets/product-1.png',
//               updatedAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//           ]}
//           sx={{ height: '100%' }}
//         /> */}
//     <Box bgcolor={'pink'} sx={{ minHeight: 120 }} />
//   </Grid>
//   <Grid
//     size={{
//       lg: 8,
//       md: 12,
//       xs: 12,
//     }}
//   >
//     {/* <LatestOrders
//           orders={[
//             {
//               id: 'ORD-007',
//               customer: { name: 'Ekaterina Tankova' },
//               amount: 30.5,
//               status: 'pending',
//               createdAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//             {
//               id: 'ORD-006',
//               customer: { name: 'Cao Yu' },
//               amount: 25.1,
//               status: 'delivered',
//               createdAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//             {
//               id: 'ORD-004',
//               customer: { name: 'Alexa Richardson' },
//               amount: 10.99,
//               status: 'refunded',
//               createdAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//             {
//               id: 'ORD-003',
//               customer: { name: 'Anje Keizer' },
//               amount: 96.43,
//               status: 'pending',
//               createdAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//             {
//               id: 'ORD-002',
//               customer: { name: 'Clarke Gillebert' },
//               amount: 32.54,
//               status: 'delivered',
//               createdAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//             {
//               id: 'ORD-001',
//               customer: { name: 'Adam Denisov' },
//               amount: 16.76,
//               status: 'delivered',
//               createdAt: dayjs().subtract(10, 'minutes').toDate(),
//             },
//           ]}
//           sx={{ height: '100%' }}
//         /> */}
//     <Box bgcolor={'pink'} sx={{ minHeight: 120 }} />
//   </Grid>
// </>;
