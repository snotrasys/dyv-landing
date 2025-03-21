import { Dialog } from '@reach/dialog';
import * as React from 'react';
import { PlayIcon, PlusIcon } from './icons/icons';

function YouTubeEmbed({ onCloseClick, ytLiteEmbed }) {
  const embedContainer = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!embedContainer.current) return;
    const ytLite = embedContainer.current.querySelector('.yt-lite');
    if (!(ytLite instanceof HTMLElement)) return;
    ytLite.click();
  }, []);

  return (
    <div className="fixed inset-0 bg-black px-5vw">
      <button
        type="button"
        id="close-video"
        aria-label="close-video"
        onClick={onCloseClick}
        className="absolute right-4 top-9 z-50 rotate-45 transform text-yellow-100 hover:scale-150 focus:scale-150 focus:outline-none"
      >
        <PlusIcon />
      </button>
      <div
        className="relative flex h-full w-full items-center justify-center"
        ref={embedContainer}
      >
        {ytLiteEmbed}
      </div>
    </div>
  );
}

function FullScreenYouTubeEmbed({ img, autoplay = false, ytLiteEmbed }) {
  const [showPlayer, setShowPlayer] = React.useState(autoplay);
  return (
    <>
      <Dialog
        isOpen={showPlayer}
        onDismiss={() => setShowPlayer(false)}
        aria-label={`Watch ${ytLiteEmbed.props.title ?? 'the video'}`}
      >
        <YouTubeEmbed
          onCloseClick={() => setShowPlayer(false)}
          ytLiteEmbed={ytLiteEmbed}
        />
      </Dialog>

      {showPlayer ? null : (
        <button
          type="button"
          className="group relative"
          id="play-video"
          aria-label="play-video"
          onClick={() => setShowPlayer(true)}
        >
          {img}
          <span className="absolute left-0 top-0 h-full w-full">
            <span className="flex h-full w-full items-center justify-center">
              <span className="transform opacity-70 transition-all group-hover:opacity-100 group-focus:opacity-100 motion-safe:group-hover:scale-110 motion-safe:group-focus:scale-110 motion-safe:group-active:scale-125">
                <PlayIcon />
              </span>
            </span>
          </span>
        </button>
      )}
    </>
  );
}

export { FullScreenYouTubeEmbed };
export { default as LiteYouTubeEmbed } from 'react-lite-youtube-embed';

export const links = () => {
  // for the youtube embed
  return [
    { rel: 'preconnect', href: 'https://www.youtube-nocookie.com' },
    { rel: 'preconnect', href: 'https://www.google.com' },
  ];
};
