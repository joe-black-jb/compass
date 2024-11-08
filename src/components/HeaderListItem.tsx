import React from "react";

interface Props {
  title: string;
  link: string;
}
const HeaderListItem = (props: Props) => {
  const { title, link } = props;
  return (
    <a
      href={link}
      className="w-full pl-4 py-2 text-sm font-semibold leading-6 text-gray-900 block hover:bg-green-100"
    >
      {title}
    </a>
  );
};

export default HeaderListItem;
