import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Ambil semua data
export async function GET() {
    const { data, error } = await supabase.from("assets").select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST - Tambah data
export async function POST(req: Request) {
    const body = await req.json();
    const { data, error } = await supabase.from("assets").insert(body);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// PUT - Update data
export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...updates } = body;
    const { data, error } = await supabase.from("assets").update(updates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// DELETE - Hapus data
export async function DELETE(req: Request) {
    const { id } = await req.json();
    const { error } = await supabase.from("assets").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Asset deleted successfully" });
}
