/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import axios from 'axios';
import { BsArrowUpRight } from 'react-icons/bs';
import Link from 'next/link';

export default function CardClass() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchPlaylistVideos = async () => {
      try {
        const playlistId = 'PLVhooQufzG5W0CkV-popWsla8UtdIEpfd';
        const apiKey = 'AIzaSyD__LoR164eM683cIa0EKI7RNikK62QT-E';
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
        const response = await axios.get(url);
        setVideos(response.data.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlaylistVideos();
  }, []);
  if (videos.length === 0) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <div className=" py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              {' '}
              #CriptoXpertXimbia
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-200">
              Se parte de nuestra comunidad educativa y aprenda sobre crypto y
              se un #XimbiaExpert
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {videos.map((video, i) => (
              <Link
                key={i}
                href={{
                    pathname: '/xacademy/[id]',
                    query: { id: video?.snippet?.resourceId?.videoId },
                    state: { video: video },
                  }}
                as={`/xacademy/${video?.snippet?.resourceId?.videoId}`}
                title={video?.snippet?.title}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <img
                  src={video?.snippet?.thumbnails?.standard?.url}
                  alt=""
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#12071f] via-purple-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <div className="mr-8">Ximbia Academy</div>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg
                      viewBox="0 0 2 2"
                      className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <a>
                    <span className="absolute inset-0" />
                    {video?.snippet?.title}
                  </a>
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
   
    </div>
  );
}
