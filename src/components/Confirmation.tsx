'use client'

import React from 'react'

function Confirmation({others, setopen, setconfirmation}:{others: string, setopen: any, setconfirmation:any}) {
  return (
    <div className={`border rounded-lg shadow relative max-w-sm ${others}`}>


      <div className="p-6  text-center">
        <svg
          className="w-20 h-20 text-gray-600 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
          Are you sure you want to delete this content?
        </h3>
        <button
            onClick={() => setconfirmation(true)}
          className="text-white bg-gray-600 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
        >
          Yes, I'm sure
        </button>
        <button
          onClick={() => setopen(false)}
          className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
        >
          No, cancel
        </button>
      </div>
    </div>
  );
}

export default Confirmation