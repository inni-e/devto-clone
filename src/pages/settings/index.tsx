import Head from "next/head";

import NavBar from "~/components/NavBar";
import SettingsSideBar from "~/components/settings/SettingsSideBar";
import ProfileSettingsSection from "~/components/settings/ProfileSettingsSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dev Community</title>
        <meta name="description" content="Dev.to clone by Eoin" />
        <link rel="icon" href="/dev.png" />
      </Head>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full md:w-3/4site flex gap-4">
          <SettingsSideBar />
          <div className="w-full relative flex flex-col gap-4">
            <ProfileSettingsSection />
          </div>
        </div>

      </main>
    </>
  );
}