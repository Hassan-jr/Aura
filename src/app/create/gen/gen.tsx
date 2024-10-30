'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import CurrentGen from './currentgen'
import {
    ArrowLeftIcon,
} from "@radix-ui/react-icons";

export const PrevGen = () => {
    const [isgen, setIsgen] = useState(false)


    return (
        <div className='bg-card/100'>
            {/* Generate Image */}

            {isgen ?
                <div>
                    <div  onClick={() => setIsgen(false)} className=' mb-[-60px] h-10 w-10 cursor-pointer bg-red-500'>
                        <ArrowLeftIcon className="h-10 w-10" />
                    </div>

                    <CurrentGen />
                </div>

                :
                <div>


                    <div className='w-full py-5  flex justify-center align-middle border-dashed border-2 border-gray-500 mb-4'>
                        <Button onClick={() => setIsgen(true)} className='text-xl font-medium ' variant='outline'>Generate Images</Button>
                    </div>
                    <p className='text-2xl font-semibold'>Recent Generation</p>
                    <div className='w-full py-5  flex justify-center align-middle'>
                        <p className='text-base font-semibold text-gray-500'>No Images in Draft</p>
                    </div>
                </div>
            }

        </div>
    )
}
