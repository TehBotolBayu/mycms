"use client";

import React, { useState, useEffect, useRef } from "react";
import LazyLoad from "@/components/LazyLoad";
import { Select, Option, Button } from "@material-tailwind/react";

const tags = [
  "Tutorial",
  "HowTo",
  "DIY",
  "Review",
  "Tech",
  "Gaming",
  "Travel",
  "Fitness",
  "Cooking",
  "Vlog",
];

function page({ params }: { params: { search: string } }) {
  const [openFilter, setOpenFilter] = useState(false)
  const [selected, setSelected] = useState<any>([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState('Newest');

  const filteredTags = tags.filter(
    (item: any) =>
      item?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase()?.trim()) &&
      !selected.includes(item)
  );

  const isDisable =
    !query?.trim() ||
    selected.filter(
      (item: string) =>
        item?.toLocaleLowerCase()?.trim() === query?.toLocaleLowerCase()?.trim()
    )?.length;

  return (
    <div className="my-14 md:my-32 md:mx-auto px-10 max-w-screen-xl w-full min-h-screen lg:flex">
      <div className="hidden lg:block mr-4">
        <div className="font-semibold text-black text-3xl mb-5">Filter</div>
        <div className="w-full border-b-2 mb-14"></div>
        <h1 className="font-semibold text-2xl mb-4">Tags</h1>
        <div className="bg-white grid">
          <div className="relative w-80 text-sm">
            {selected?.length ? (
              <div className="bg-white w-80 relative text-xs flex flex-wrap gap-1 p-2 mb-2">
                {selected.map((tag) => {
                  return (
                    <div
                      key={tag}
                      className="cursor-pointer rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500
                  flex items-center gap-2"
                    >
                      {tag}
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={() => {
                          setSelected(selected.filter((i) => i !== tag));
                        }}
                      >
                        <div>X</div>
                      </div>
                    </div>
                  );
                })}
                <div className="w-full text-right">
                  <div
                    className="text-gray-400 cursor-pointer"
                    onClick={() => {
                      setSelected([]);
                      inputRef.current?.focus();
                    }}
                  >
                    Clear all
                  </div>
                </div>
              </div>
            ) : null}
            <div className="card flex items-center justify-between p-3 w-80 gap-2.5">
              <div>search</div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value.trimStart());
                }}
                placeholder="Search or Create tags"
                className="bg-transparent text-sm flex-1 caret-gray-600"
                onFocus={() => {
                  setMenuOpen(true);
                }}
                onBlur={() => {
                  setMenuOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isDisable) {
                    setSelected((prev) => [...prev, query]);
                    setQuery("");
                    setMenuOpen(true);
                  }
                }}
              />
              <button
                className="text-sm disabled:text-gray-300 text-gray-500 disabled:cursor-not-allowed "
                disabled={isDisable}
                onClick={() => {
                  if (isDisable) {
                    return;
                  }
                  setSelected((prev) => [...prev, query]);
                  setQuery("");
                  inputRef.current?.focus();
                  setMenuOpen(true);
                }}
              >
                + Add
              </button>
            </div>

            {/* Menu's */}
            {menuOpen ? (
              <div className="bg-white card absolute w-full max-h-52 mt-2 p-4 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                <ul className="w-full">
                  {filteredTags?.length ? (
                    filteredTags.map((tag, i) => (
                      <li
                        key={tag}
                        className="p-2 cursor-pointer hover:bg-gray-50 hover:text-gray-500 rounded-md w-full"
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={() => {
                          setMenuOpen(true);
                          setSelected((prev) => [...prev, tag]);
                          setQuery("");
                        }}
                      >
                        {tag}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No options available</li>
                  )}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* checkbox filter */}
      { 
      <div className={
        `lg:hidden  transition-all ease-linear duration-3000 top-0 left-0 w-screen h-screen flex justify-center items-center z-10 fixed
        ${(openFilter)? 'visible translate-y-0':'invisible translate-y-20'} `
      }>
        <div className="relative rounded overflow-hidden shadow-lg p-4 bg-white mx-10 px-8 w-full">
          <div className="w-full mb-2 flex justify-between items-center">
            <h1 className="text-lg font-bold">Tags</h1>
            <h1 onClick={()=>setOpenFilter(p=>!p)} className="cursor-pointer text-lg font-bold">X</h1>
          </div>
          <div className="flex flex-col items-start mb-4">
            {
              tags.map((e, i)=>
                <div key={i} className="my-1">
                  <input
                    onChange={()=>{ 
                      if(selected.includes(e)){
                        setSelected(selected.filter((i) => i !== e));
                      } else setSelected((prev) => [...prev, e]);
                    }}
                    checked={selected.includes(e)}
                  type="checkbox" className="cursor-pointer form-checkbox h-5 w-5 text-gray-600"/>
                  <span className="ml-2 text-gray-700 text-lg">{e}</span>
                </div>
              )
            }
          </div>
        </div>
      </div>
      }
      {/* checkbox filter */}

      <div className="mt-20 md:mt-0">
        <div className="w-full flex justify-between mb-5">
          <div className="font-semibold text-black text-lg lg:text-3xl whitespace-nowrap mr-2 flex items-center">
            Found result
          </div>
          {/* sort by selection */}
          <div className="relative h-10 w-72 min-w-[200px] hidden lg:block">
            <select
              onChange={(e) => setSort(e.target.value)}
              className=" cursor-pointer peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            >
              <option value="1">Newest</option>
              <option value="-1">Oldest</option>
            </select>
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Sort By
            </label>
          </div>
          {/* sort by selection mobile */}
          <div className="relative h-10 w-72 min-w-[200px] lg:hidden flex flex-row">
            <select
              onChange={(e) => setSort(e.target.value)}
              className=" cursor-pointer peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            >
              <option value="1">Newest</option>
              <option value="-1">Oldest</option>
            </select>
            <button onClick={()=>setOpenFilter(p=>!p)} className="ml-2 text-left  cursor-pointer peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-4 py-2.5 font-sans text-sm ">
              Filter
            </button>
          </div>
        </div>
        {/* content result */}
        <div className="w-full border-b-2 mb-5"></div>
        <LazyLoad
          mode="search"
          sort={sort}
          querystring={params.search}
          filter={selected}
        />
      </div>
    </div>
  );
}

export default page;


