'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import CurrentGen from './currentgen'
import {
    ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const PrevGen = () => {
    const [isgen, setIsgen] = useState(false)


    return (
        <div className='bg-card/100'>
            {/* Generate Image */}

            <Dialog open={isgen} onOpenChange={()=>setIsgen(true)}>
                <DialogContent className="sm:max-w-[500px] p-0 m-0">
                    <div>
                        <CurrentGen cancel={setIsgen} />
                    </div>
                </DialogContent>
            </Dialog>


            <div>

                <div className='w-full py-5  flex justify-between align-middle mb-4'>
                    <p className='text-2xl font-semibold'>Recent Generation</p>
                    <Button onClick={() => setIsgen(true)} className='text-2xl font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white' variant='outline'>Generate Images</Button>
                </div>

                <div className='bg-card/50 shadow-lg w-full py-5 mt-2  flex justify-center align-middle'>
                    <p className='text-base font-semibold text-gray-500'>No Images in Draft</p>
                </div>
            </div>


        </div>
    )
}
