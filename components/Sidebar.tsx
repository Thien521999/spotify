import {
  BuildingLibraryIcon, HomeIcon, MagnifyingGlassIcon, PlusIcon, RssIcon
} from '@heroicons/react/24/outline';
import React from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { useSpotify } from '../hooks/useSpotify';
import { IconButton } from './IconButton';

export const Divider = () => (
  <hr className="border-t-[0.1px] border-gray-900" />
);

export const Sidebar = () => {
  const spotifyApi = useSpotify();

  const {
    playlistContextState: { playlists },
    updatePlaylistContextState
  } = usePlaylistContext();

  const setSelectedPlaylist = async(playlistId: string)=> {
    const playlistResponse = await spotifyApi.getPlaylist(playlistId);
    updatePlaylistContextState({
      selectedPlaylistId: playlistId,
      selectedPlaylist: playlistResponse.body
    })
  }

  return (
    <div className="text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow:y-scroll scrollbar-hidden sm:max-w-[12rem] ld:max-w-[15rem] hidden md:block">
      <div className="space-y-4">
        
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={MagnifyingGlassIcon} label="Search" />
        <IconButton icon={BuildingLibraryIcon} label="Your Library" />

        <Divider />

        <IconButton icon={PlusIcon} label="Create Playlist" />
        <IconButton icon={PlusIcon} label="Liked Songs" />
        <IconButton icon={RssIcon} label="Your episodes" />

        <Divider />

        {/* Playlist */}
        {playlists.map(({id, name}) => (
          <p key={id} className="cursor-pointer hover:text-white"
            onClick={()=> setSelectedPlaylist(id)}
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  );
};
