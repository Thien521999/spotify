import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import Image from 'next/image';
import UserIcon from '../assets/user.png';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { pickRandom } from '../utils/pickRandom';
import { Songs } from './Songs';

type Props = {};

const colours = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

export const Center = (props: Props) => {
  const {
    playlistContextState: { selectedPlaylist, selectedPlaylistId },
  } = usePlaylistContext();
  const { data: session } = useSession();

  const [fromColour, setFromColour] = useState<string | null>(null);

  useEffect(() => {
    setFromColour(pickRandom(colours));
  }, [selectedPlaylistId]);

  return (
    <div className="flex-grow text-white relative h-screen overflow-y-scroll scrollbar-hidden">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => {
            signOut();
          }}
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2"
        >
          <Image
            src={session?.user?.image || UserIcon}
            alt="User Avatar"
            width="40px"
            height="40px"
            className="rounded-full object-cover"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="icon" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${fromColour} to-black h-80 p-8`}
      >
        {selectedPlaylist && (
          <>
            <Image
              src={selectedPlaylist.images[0].url || ''}
              alt="Playlist"
              height="176px"
              width="176px"
              className="shadow-2xl"
            />
            <div>
              <p>Playlist</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {selectedPlaylist.name}
              </h1>
            </div>
          </>
        )}
      </section>
      
      <div>
        <Songs />
      </div>
    </div>
  );
};
