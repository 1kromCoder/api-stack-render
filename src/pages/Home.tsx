import {
  useDeleteStackMutation,
  useGetAllStacksQuery,
} from "../store/stacksApi";
import { Button } from "../components/ui/button";
import { API } from "../hooks/getEnv";
import { formatTime } from "../hooks/formatTime";
import { SquarePen, Trash } from "lucide-react";
import Modal from "../components/Modal";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogClose } from "../components/ui/dialog";

export interface StackType {
  id: number;
  name: string;
  createdAt: string;
  image: string;
}

function Home() {
  const { data: stacks = {}, isLoading, isError } = useGetAllStacksQuery("");

  const [deleteFn] = useDeleteStackMutation();

  if (isLoading) "Loading...";
  if (isError) "Error";
  function handleDelete(id: number) {
    deleteFn(id);
  }
  return (
    <>
      <div className="flex flex-wrap justify-between gap-[20px] p-5">
        {stacks?.data?.map((item: StackType) => (
          <div
            key={item.id}
            className="w-[250px] bg-slate-800 rounded-md overflow-hidden text-white"
          >
            <img
              className="mb-2"
              src={`${API}/file/${item.image}`}
              alt="stack img"
              width={300}
              height={200}
            />
            <div className="p-3 ">
              <h2 className="text-[20px] font-bold">{item.name} </h2>
              <p>{formatTime(item.createdAt)}</p>
            </div>
            <div className="flex justify-end gap-2 p-2">
              <div className="bg-yellow-600 w-[35px] h-[35px] flex justify-center items-center rounded-md cursor-pointer">
                <SquarePen size={25} />
              </div>
              <Dialog>
                <DialogTrigger>
                  <div className=" bg-red-600 w-[35px] h-[35px] flex justify-center items-center rounded-md cursor-pointer">
                    <Trash size={25} />
                  </div>
                </DialogTrigger>
                <Modal title="Confirm to Delete!">
                  <div className="justify-end gap-2 flex">
                    <DialogClose>
                      <div className="p-2 px-3 text-white font-semibold cursor-pointer hover:opacity-80 duration-200 rounded-md bg-slate-950 ">
                        Cancel
                      </div>
                    </DialogClose>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </Modal>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
