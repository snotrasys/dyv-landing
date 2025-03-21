import { Fragment, useRef, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ButtonPopover({
  menuTitle = 'Core',
  linksArray = [
    [
      `Ther multiplier represents the proportion of Token rewards each farm receives, as a proportion of the Token produced each block.
    For example, if a 1x farm received 1 LOLLI per block, a 40x farm would receive 40 LOLLI per block.
    This amount is already included in all APR calculations for the farm. `,
    ],
  ],
}) {
  let timeout;
  const timeoutDuration = 500;

  const buttonRef = useRef(null);
  const [openState, setOpenState] = useState(false);

  const toggleMenu = (open) => {
    setOpenState((openState) => !openState);

    buttonRef?.current?.click(); // eslint-disable-line
  };

  const onHover = (open, action) => {
    if (
      (!open && !openState && action === 'onMouseEnter') ||
      (open && openState && action === 'onMouseLeave')
    ) {
      clearTimeout(timeout);

      timeout = setTimeout(() => toggleMenu(open), timeoutDuration);
    }
  };

  const handleClick = (open) => {
    setOpenState(!open);
    clearTimeout(timeout);
  };

  const LINK_STYLES = classNames('text-white  items-center justify-center');
  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      event.stopPropagation();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
  return (
    <a href={process.env.REACT_APP_AUDIT_URL} target="_blank" rel="noreferrer">
      <div
        className={classNames(
          'border-primary mr-2 inline-flex items-center rounded-full border bg-transparent px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary hidden h-5 w-5 md:block mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>{' '}
        <Popover className="z-20">
          {({ open }) => (
            <div
              onMouseEnter={() => onHover(open, 'onMouseEnter')}
              onMouseLeave={() => onHover(open, 'onMouseLeave')}
              className="flex flex-col"
            >
              <Popover.Button ref={buttonRef}>
                <div
                  className={classNames(
                    open ? 'text-pink-500' : 'text-pink-500',

                    'flex justify-center text-primary',
                    LINK_STYLES,
                  )}
                  onClick={() => handleClick(open)}
                >
                  {menuTitle}
                </div>
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel static className="absolute right-[90px] z-10">
                  <div
                    className={classNames(
                      'text-md bg-primary self-start rounded-lg px-6  py-6 text-white',
                    )}
                  >
                    {linksArray.map(([title, href]) => (
                      <Fragment key={'PopoverPanel<>' + title + href}>
                        <a href={href}>
                          Ther multiplier represents the proportion of Token
                          rewards each farm receives, as a proportion of the
                          Token produced each block. <br /> <br />
                          For example, if a 1x farm received 1 XIMBIA per block,
                          a 40x farm would receive 40 XIMBIA per block. <br />{' '}
                          <br />
                          This amount is already included in all APR
                          calculations for the farm.{' '}
                        </a>
                      </Fragment>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </div>
          )}
        </Popover>
      </div>
    </a>
  );
}
