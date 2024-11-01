import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";

interface Props {
  SummaryTitle: JSX.Element;
  Main: JSX.Element;
}

const DisclosureSummary = (props: Props) => {
  const { SummaryTitle, Main } = props;

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton as="div">{SummaryTitle}</DisclosureButton>
          <Transition
            enter="transition-all duration-300 ease-in-out"
            enterFrom="max-h-0 opacity-0"
            enterTo="max-h-screen opacity-100"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="max-h-screen opacity-100"
            leaveTo="max-h-0 opacity-0"
          >
            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-900">
              {Main}
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default DisclosureSummary;
