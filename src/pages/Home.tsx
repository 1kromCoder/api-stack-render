import { useState } from "react";
import {
  useDeleteStackMutation,
  useGetAllStacksQuery,
  useUpdateStackMutation,
} from "../store/stacksApi";
import { Button } from "../components/ui/button";
import { API } from "../hooks/getEnv";
import { formatTime } from "../hooks/formatTime";
import { SquarePen, Trash } from "lucide-react";
import Modal from "../components/Modal";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

export interface StackType {
  id: number;
  name: string;
  createdAt: string;
  image: string;
}

function Home() {
  const { data: stacks = {}, isLoading, isError } = useGetAllStacksQuery("");
  const [deleteFn] = useDeleteStackMutation();
  const [updateFn] = useUpdateStackMutation();

  const [editData, setEditData] = useState<StackType | null>(null);
  const [newName, setNewName] = useState("");
  const [newCreatedAt, setNewCreatedAt] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"delete" | "edit" | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  const handleUpdate = async () => {
    if (!editData) return;

    const updates: any = {};

    if (newName.trim() && newName !== editData.name) {
      updates.name = newName;
    }

    if (newCreatedAt && newCreatedAt !== editData.createdAt.slice(0, 10)) {
      updates.createdAt = newCreatedAt;
    }

    if (newImage) {
      try {
        const base64 = await convertToBase64(newImage);
        updates.image = base64;
      } catch (error) {
        console.error("Rasmni o‘qishda xatolik:", error);
        return;
      }
    }

    if (Object.keys(updates).length === 0) {
      alert("Hech qanday o‘zgarish kiritilmadi.");
      return;
    }

    try {
      await updateFn({
        id: editData.id,
        body: updates,
      }).unwrap();

      closeModal();
    } catch (error) {
      console.error("Update ishlamadi:", error);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const closeModal = () => {
    setEditData(null);
    setModalType(null);
    setNewName("");
    setNewCreatedAt("");
    setNewImage(null);
    setPreviewImage(null);
  };

  const handleDelete = (id: number) => {
    deleteFn(id);
    closeModal();
  };

  return (
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
          <div className="p-3">
            <h2 className="text-[20px] font-bold">{item.name}</h2>
            <p>{formatTime(item.createdAt)}</p>
          </div>

          <div className="flex justify-end gap-2 p-2">
            {/* ✏️ EDIT DIALOG */}
            <Dialog
              open={modalType === "edit" && editData?.id === item.id}
              onOpenChange={(open) => {
                if (!open) closeModal();
              }}
            >
              <DialogTrigger asChild>
                <div
                  className="bg-yellow-600 w-[35px] h-[35px] flex justify-center items-center rounded-md cursor-pointer"
                  onClick={() => {
                    setEditData(item);
                    setNewName(item.name);
                    setNewCreatedAt(item.createdAt.slice(0, 10));
                    setModalType("edit");
                  }}
                >
                  <SquarePen size={25} />
                </div>
              </DialogTrigger>
              <Modal title="Update Stack">
                <div className="flex flex-col gap-4">
                  <input
                    className="p-2 rounded-md text-black"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New name"
                  />

                  <input
                    type="date"
                    value={newCreatedAt}
                    onChange={(e) => setNewCreatedAt(e.target.value)}
                    className="p-2 rounded-md text-black"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewImage(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="text-black"
                  />

                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      className="bg-slate-950 text-white"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-yellow-600" onClick={handleUpdate}>
                      Update
                    </Button>
                  </div>
                </div>
              </Modal>
            </Dialog>

            {/* 🗑️ DELETE DIALOG */}
            <Dialog
              open={modalType === "delete" && editData?.id === item.id}
              onOpenChange={(open) => {
                if (!open) closeModal();
              }}
            >
              <DialogTrigger asChild>
                <div
                  className="bg-red-600 w-[35px] h-[35px] flex justify-center items-center rounded-md cursor-pointer"
                  onClick={() => {
                    setEditData(item);
                    setModalType("delete");
                  }}
                >
                  <Trash size={25} />
                </div>
              </DialogTrigger>
              <Modal title="Confirm to Delete!">
                <div className="justify-end gap-2 flex">
                  <Button
                    variant="ghost"
                    className="bg-slate-950 text-white"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
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
  );
}

export default Home;
