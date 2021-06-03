import React, {Fragment, useState} from "react"

const SelectedUpload = () => {

    return (
        <div class="w-full min-h-screen">
  <div class="flex absolute bottom-0 left-0 bg-white mb-6 ml-6 mr-6 max-w-lg rounded-lg shadow-2xl p-4">
    <div class="flex-none w-32 sm:w-48 relative overflow-hidden rounded-md">
      <img src="https://images.unsplash.com/photo-1580923368248-877f237696cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=300&q=60" alt="image" class="absolute inset-0 w-full h-full object-cover"/>
    </div>
    <div class="w-full md:w-3/5 relative flex flex-col ml-4">
      <a href="#" class="absolute top-0 right-0 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>
</a>
      <p class="text-sm font-bold mb-2 mr-4">Complete our design survey & get stickers!</p>
      <p class="text-xs">When you complete our community survey, you’ll not only help make Dribbble better, you’ll also get a link to receive a free Exclusive Dribbble sticker pack from Stickermule!</p>
      <div class="flex sm:justify-end items-stretch h-full">
        <a href="#" class="self-end w-full text-center sm:w-auto sm:text-left mt-4 text-xs text-white rounded-md bg-purple-600 p-2 px-4 hover:bg-purple-500">Start the Survey</a>
      </div>
    </div>
  </div>
</div>
    )
}

export default SelectedUpload