"use client";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Asset {
  id: number;
  name: string;
  type: string;
  value: number;
}

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState<Partial<Asset>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    const { data } = await supabase.from("assets").select("*");
    setAssets(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEditing) {
      await supabase.from("assets").update(form).eq("id", form.id);
    } else {
      await supabase.from("assets").insert(form);
    }
    fetchAssets();
    setForm({});
    setIsEditing(false);
  }

  async function handleDelete(id: number) {
    await supabase.from("assets").delete().eq("id", id);
    fetchAssets();
  }

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Asset Management</h1>

        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Type"
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Value"
            value={form.value || ""}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
          />
          <button className="bg-blue-500 text-white p-2 w-full" type="submit">
            {isEditing ? "Update" : "Add"} Asset
          </button>
        </form>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Value</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="border p-2">{asset.id}</td>
                <td className="border p-2">{asset.name}</td>
                <td className="border p-2">{asset.type}</td>
                <td className="border p-2">{asset.value}</td>
                <td className="border p-2 space-x-2">
                  <button className="bg-yellow-500 text-white p-1"
                    onClick={() => { setForm(asset); setIsEditing(true); }}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white p-1"
                    onClick={() => handleDelete(asset.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
