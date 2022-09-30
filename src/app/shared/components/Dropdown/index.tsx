import { Menu, Transition } from '@headlessui/react';
import { ReactNode } from 'react';

export default function Dropdown({
  children,
  options,
  classButton,
  menuItems,
  classMenuItems,
  openDirection,
}: {
  children: ReactNode;
  options?: { text: string; onClick: () => void }[];
  classButton?: string;
  menuItems?: ReactNode[];
  classMenuItems: string;
  openDirection: 'left' | 'right';
}): JSX.Element {
  const Item = (item): ReactNode => {
    return item;
  };

  return (
    <Menu as="div" className="relative">
      <div className="relative flex items-center">
        <Menu.Button className={`outline-none cursor-pointer ${classButton}`}>{children}</Menu.Button>
      </div>
      <Transition
        className={`absolute ${openDirection === 'left' ? 'left-0' : 'right-0'}`}
        enter="transform transition duration-50 ease-out"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transform transition duration-50 ease-out"
        leaveFrom="scale-95 opacity-100"
        leaveTo="scale-100 opacity-0"
      >
        <Menu.Items
          className={`focus:outline-none absolute flex flex-col ${classMenuItems} ${
            openDirection === 'left' ? 'origin-top-left' : 'origin-top-right'
          }`}
        >
          {options?.map((option) => (
            <Menu.Item key={option.text}>
              <div
                style={{ lineHeight: 1 }}
                className="cursor-pointer py-1.5 px-3 text-gray-80 hover:bg-primary hover:text-white active:bg-primary-dark"
                onClick={option.onClick}
              >
                {option.text}
              </div>
            </Menu.Item>
          ))}
          {menuItems && (
            <div className="w-full max-w-xs">
              {menuItems?.map((item, index) =>
                item === 'separator' ? (
                  <div key={'separator-' + index} className="my-0.5 mx-3 border-t border-gray-10" />
                ) : (
                  <Menu.Item key={'menuitem-' + index}>
                    {({ active }) => (
                      <div className={`flex cursor-pointer ${active && 'bg-gray-5'} hoer:bg-gray-5 active:bg-gray-10`}>
                        {item}
                      </div>
                    )}
                  </Menu.Item>
                ),
              )}
            </div>
          )}
          {/* <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                {active ? (
                  <DuplicateActiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                ) : (
                  <DuplicateInactiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                )}
                Duplicate items
              </button>
            )}
          </Menu.Item> */}
        </Menu.Items>
      </Transition>
    </Menu>
  );
  // return (
  //   <div className="relative">
  //     <Menu as="div" className="relative">
  //       <div className="relative flex items-center">
  //         <Menu.Button className={`outline-none cursor-pointer ${classButton}`}>{children}</Menu.Button>
  //       </div>

  //       <Transition
  //         className={`absolute ${openDirection === 'left' ? 'left-0' : 'right-0'}`}
  //         enter="transform transition duration-50 ease-out"
  //         enterFrom="scale-98 opacity-0"
  //         enterTo="scale-100 opacity-100"
  //         leave="transform transition duration-50 ease-out"
  //         leaveFrom="scale-98 opacity-100"
  //         leaveTo="scale-100 opacity-0"
  //       >
  //         <Menu.Items className={`absolute ${classMenuItems}`}>
  //           {options?.map((option) => (
  //             <Menu.Item key={option.text}>
  //               <div
  //                 style={{ lineHeight: 1 }}
  //                 className="cursor-pointer py-1.5 px-3 text-gray-80 hover:bg-primary hover:text-white active:bg-primary-dark"
  //                 onClick={option.onClick}
  //               >
  //                 {option.text}
  //               </div>
  //             </Menu.Item>
  //           ))}
  //           {menuItems && (
  //             <div className="w-full max-w-xs">
  //               {menuItems?.map((item, index) => (
  //                 <Menu.Item key={'menuitem-' + index}>{({ active }) => item}</Menu.Item>
  //               ))}
  //             </div>
  //           )}
  //         </Menu.Items>
  //       </Transition>
  //     </Menu>
  //   </div>
  // );
}
