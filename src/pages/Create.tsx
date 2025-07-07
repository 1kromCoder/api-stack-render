import { useState } from "react";
import { useCreateStackMutation } from "../store/stacksApi";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const Create = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const [createStack, { isLoading, isError, error }] = useCreateStackMutation();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !image) {
      alert("Iltimos, nom va rasmni tanlang!");
      return;
    }

    try {
      const base64Image = await convertToBase64(image);

      const data = {
        name,
        image: base64Image, 
      };

      await createStack(data).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Stack yaratishda xatolik:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl text-center font-semibold mb-4">Create a new stack</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Stack name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Masalan: React"
          />
        </div>

        <div>
          <label htmlFor="image" className="block !mt-[30px] font-medium mb-1">
            Stack image:
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mt-2"
          />
        )}

        <Button
          type="submit"
          className="bg-blue-600 mt-[20px] text-white w-full"
          disabled={isLoading}
        >
          {isLoading ? "Yaratilmoqda..." : "Saqlash"}
        </Button>

        {isError && (
          <p className="text-red-500 mt-2">
            Xatolik: {(error as any)?.data?.message || "Noma'lum xatolik"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Create;
