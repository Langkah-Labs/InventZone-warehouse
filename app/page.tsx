"use client";

import Card from "@/components/Card";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <Card>
        <div className="flex flex-col w-full gap-6">
          <h1 className="w-full text-gray-700 font-bold font-sans text-center text-xl">
            Start Creating Data
          </h1>

          <div className="flex w-full gap-4">
            <Card>
              <div className="flex items-center gap-4">
                <PencilIcon className="h-6 w-6" />

                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold">Create new product</h1>
                  <p className="text-sm">Lorom ipsum dolor sit amet</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <PencilIcon className="h-6 w-6" />

                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold">Create new serial number</h1>
                  <p className="text-sm">Lorom ipsum dolor sit amet</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </>
  );
}
