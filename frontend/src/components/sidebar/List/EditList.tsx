import React, { useEffect, useState } from "react";
import { useMenu } from "./MenuProvider";
import { Circle } from "lucide-react";
import { AddListTypes } from "../../customHooks/usePersonalList";
import { ListTypes } from "../../customHooks/usePersonalList";
import { addListSchema } from "../../customHooks/usePersonalList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { usePersonalListContext } from "../../../context/PersonalListContext";
import { useGetPersonalList } from "../../customHooks/useGetPersonalList";

export const EditList = () => {
  const [listData, setListData] = useState<ListTypes | null>(null);
    const { toggleEditMenu, setOpenEdit, openEdit ,id} = useMenu();
    const {data} = useGetPersonalList(id);

    useEffect(()=>{
      if(data){
        setListData(data);
        setValue("name",data.name);
        setValue("color",data.color);
      }
    },[data])
  
  const {editListCall,editListsError,editListsLoading} = usePersonalListContext();
  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenEdit(false);
      }
    };
    document.addEventListener("keydown", escFunction);
    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, []);

  const colorPresets: string[] = [
    '#9775FA',// Violet
   '#FF6E6E', // Bright coral
  '#63E6E2', // Cyan
  '#74C0FC', // Light blue
  '#B197FC', // Periwinkle
  '#FF8787', // Peach
  '#51CF66', // Lime
  '#FCC419', // Gold
  '#FF922B', // Orange
  '#F783AC'  // Blush pink
  ];


  const {register,handleSubmit,setValue,watch,formState:{errors,isSubmitting,isSubmitted,isValid}} = useForm<AddListTypes>({
    resolver:zodResolver(addListSchema),
    defaultValues:{name:listData?.name,color:listData?.color}
  });

  const selectedColor = watch('color');
  const nameValue = watch('name');

  const isDisabled = isSubmitting||!nameValue?.trim();

  
  async function onSubmit(d:AddListTypes){
      if (!listData?.id) {
    console.warn("No list data or ID");
    return;
  }
    try {
      editListCall({id:listData?.id,data:d});

  } catch (err) {
    console.error("Failed to add list:", err);
  }
  }

  if(editListsError){
    console.log(editListsError);
  }


  return (
    <div className="absolute  flex items-center justify-center w-full h-screen z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="absolute w-[450px]">
        <div style={{
    border: `1px solid ${selectedColor}`
  }} className="p-6 bg-white rounded-md shadow-xl transition-all ease-in-out duration-300 dark:bg-zinc-900">
          <div className="flex justify-center">
            <h2 className="text-lg mb-7 font-semibold text-gray-900 capitalize dark:text-texto">
              Add List
            </h2>
            {errors && (
              <div className="text-white">{errors.name?.message}</div>
            )}
            {errors && (
              <div className="text-white">{errors.color?.message}</div>
            )}
          </div>

          <div className="flex flex-col space-y-8">
            <div className="mx-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-texto text-gray-700"
              >
                List Name
              </label>
              <div className="my-2">
                <input
                {...register("name")}
                  type="text"
                  autoComplete="off"
                  className={`outline-none bg-white dark:bg-zinc-900 ring-[0.5px] ring-gray-400 dark:ring-zinc-700 caret-primary dark:caret-purple-200 focus:ring-1 focus:ring-primary pl-2 w-full h-8 text-gray-700 dark:text-white dark:focus:ring-purple-200 rounded-md`}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mx-1 mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium dark:text-texto text-gray-700"
                >
                 List Color
                </label>
                <div className="flex items-center justify-center space-x-2">
                  {colorPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={()=>setValue('color',preset)}
                      className="w-5 h-5"
                      aria-label={`Select color ${preset}`}
                    >
                      
                      <div className="flex flex-col">
                       <Circle fill={preset} stroke={preset} />
                      {selectedColor === preset &&(
                        <div className="flex items-center justify-center pl-[3px]"><Circle size={16} fill={preset} stroke="transparent"></Circle></div>
                      )}</div>
                     
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
              type="button"
                onClick={toggleEditMenu}
                className="flex items-center justify-center text-sm px-4 py-2.5 w-16 h-8 leading-5 text-white transition-colors duration-300 transdi bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                Cancel
              </button>
              <button disabled={isDisabled} type="submit" className={`${isDisabled?'opacity-40':'opacity-100 hover:bg-indigo-500'} transition-all ease-in-out duration-300 flex items-center justify-center text-sm px-4 py-2.5 min-w-16 h-8 leading-5 bg-primary  text-white transform rounded-md focus:outline-none focus:bg-gray-600`}>
                {isSubmitting?<p>Editing...</p>:<p>Edit</p>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditList;
