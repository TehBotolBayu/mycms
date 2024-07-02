import React from "react";
import Image from "next/image";
import {
  Button,
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface BlogPostCardProps {
  img: string;
  title: string;
  desc: string;
  tags: string[];
  date: string;
  name: string;
}

export function BlogPostCardH({
  name,
  img,
  title,
  desc,
  tags,
  date,
}: BlogPostCardProps) {
  return (
    <>
      <div className="relative bg-clip-border rounded-xl bg-white text-gray-700 shadow-lg w-full p-2 md:p-6">
        <h6 className="md:my-2 flex justify-between items-center font-sans text-xs antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
          <span className="truncate ...">{name}</span> <span>{date}</span>
        </h6>
        <div className="flex">
          <div className="flex items-start lg:items-center relative lg:w-2/5 m-0 overflow-hidden text-gray-700  rounded-r-none bg-clip-border rounded-xl shrink-0 mr-4 lg:mr-0">
            <img
              src={img}
              alt="card-image"
              className="object-cover object-center w-16 lg:w-full md:h-[200px] h-16 "
            />
          </div>
          <div className="py-2 lg:p-6">
            <h4 className="block mb-2 font-sans md:text-2xl text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              {title}
            </h4>
            <p className=" md:block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700 text-ellipsis overflow-hidden ...">
              {desc}
            </p>
            <div>
              {tags && tags[0] ? (
                <div
                  className="text-xs rounded-full w-fit py-1 px-2 border
                border-gray-400 bg-gray-50 text-gray-500 mr-2
                "
                >
                  {tags[0]}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPostCardH;
