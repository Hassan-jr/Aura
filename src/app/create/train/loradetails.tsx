'use client'
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";

import {
  addCharacterName,
  addGenderType,
  addTokenName,
} from "@/redux/slices/trainlora";

export default function LoraDetails() {
  const dispatch = useAppDispatch();

  const handleCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(addCharacterName(e.target.value));
  };

  const handleGenderChange = (value: string) => {
    dispatch(addGenderType(value));
  };

  const handleTokenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(addTokenName(e.target.value));
  };

  return (
    <main className="flex items-center justify-center mt-1 p-1">
      {/* CARD */}
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl grid grid-cols-1 md:grid-cols-2 z-20">
        {/* Character Name */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="character">Model Name</Label>
          <Input
            type="text"
            id="character"
            placeholder="Model Name"
            onChange={handleCharacterNameChange}
            required={true}
          />
        </div>

        {/* Gender */}
        {/* <div className="w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={handleGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Character Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  className="dark:text-white font-semibold"
                  value="Male"
                >
                  Male
                </SelectItem>
                <SelectItem
                  className="dark:text-white font-semibold"
                  value="Female"
                >
                  Female
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}

        {/* Token */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="token">Token</Label>
          <Input
            type="text"
            id="token"
            placeholder="Token"
            onChange={handleTokenNameChange}
          />
        </div>
      </div>
    </main>
  );
}
