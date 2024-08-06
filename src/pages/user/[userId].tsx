import { type GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import superjson from 'superjson';
import { type RouterOutputs } from '~/utils/api';
import { useSession } from 'next-auth/react';

import StatsBlock from "~/components/user/StatsBlock"
import ProfileImage from "~/components/ProfileImage";
import NavBar from "~/components/NavBar";
import PostsViewByUserId from "~/components/user/PostsViewByUserId";
import Link from 'next/link';

interface UserPageProps {
  user: RouterOutputs["user"]["getUserById"];
}

const UserPage = ({ user }: UserPageProps) => {

  const { id, name, image, bio, email } = user;
  const { data: sessionData } = useSession();

  console.log(user);
  // console.log("User id: " + user.id);
  console.log("User name: " + name);

  // FIXME: fix image src path

  return (
    <>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-0 md:px-4">
        <div className='bg-black h-32 mt-14 absolute inset-x-0 top-0 z-0'></div>
        <div className="w-full md:w-3/4site py-2 sm:py-12 flex flex-col gap-4">
          <div className='w-full bg-white h-60 z-10 rounded-md border border-gray-200'>
            <div className='relative flex justify-end items-center w-full pt-4 px-4 sm:p-8'>
              <div className='absolute flex justify-center items-center -top-6 left-4 rounded-full w-14 h-14 bg-black 
                              md:-top-16 md:left-1/2 md:-translate-x-1/2 md:w-32 md:h-32'>
                <ProfileImage
                  className="w-12 h-12 md:w-28 md:h-28"
                  user={{
                    ...user,
                    name: name ?? null,
                    image: image ?? null,
                    email: email ?? null,
                  }}
                />
              </div>
              {id === sessionData?.user.id &&
                <Link href="/settings">
                  <button
                    className="text-white font-bold w-32 h-10 bg-blue-700 hover:bg-blue-800 rounded-md"
                  >
                    Edit profile
                  </button>
                </Link>
              }

            </div>
            <div className='flex items-start sm:items-center flex-col gap-0 px-4 sm:gap-4'>
              <h1 className='font-bold text-2xl sm:text-4xl'>{name}</h1>
              <p className='text-gray-500 text-md'>{bio}</p>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row justify-between gap-4'>
            <div className='w-full p-5 h-40 lg:w-1/3 bg-white flex flex-col rounded-md border border-gray-200'>
              <StatsBlock />
            </div>
            <div className='w-full lg:w-2/3 flex flex-col gap-4'>
              <PostsViewByUserId userId={id} />
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

// TODO: Implement loading state
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  const userId = params?.userId as string;

  if (!userId) {
    return {
      notFound: true,
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: null },
    transformer: superjson,
  });

  const user = await helpers.user.getUserById.fetch({ id: userId });

  if (!user) {
    return {
      notFound: true,
    };
  }


  return {
    props: {
      user: user,
    },
  };
};

export default UserPage;