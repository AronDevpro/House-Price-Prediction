import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";

const Dropdown = ({ label, options, selectedOption, onChange }) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className={`text-sm font-medium mb-1 text-gray-700`}>{label}</label>
      <Listbox value={selectedOption} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button
            className={`w-full p-2 border rounded-md text-left  focus:border-blue-500 bg-white text-gray-900 border-gray-300`}
          >
            {selectedOption}
            <CheckIcon className="w-5 h-5 absolute top-2 right-2 text-gray-400" />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white border-gray-300 text-gray-900`}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option}
                  value={option}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                >
                  {option}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
