import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { title, author, bookCode, quantity } = body;
        const existingBook = await prisma.book.findUnique({
            where: {
                bookCode,
            }
        })
        if (existingBook) {
            return NextResponse.json({ message: "Book already exists" });
        }
        const newBook = await prisma.book.create({
            data: {
                title,
                author,
                bookCode,
                totalQuantity: Number(quantity),
                availableQuantity: Number(quantity)
            }
        })
        return NextResponse.json({ message: "suceessfully inserted book", book: newBook })
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { bookCode, quantity } = body;
        const existingBook = await prisma.book.findUnique({
            where: {
                bookCode,
            }
        })
        if (existingBook) {
            await prisma.book.update({
                where: {
                    bookCode,
                },
                data: {
                    totalQuantity: {
                        increment: Number(quantity),
                    },
                    availableQuantity: {
                        increment: Number(quantity)
                    }
                }
            })
            return NextResponse.json({ message: "successfully updated book" }, { status: 200 });
        }
        return NextResponse.json({ message: "Nothing to update" }, { status: 404 })

    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function GET(req:NextRequest){
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const books = await prisma.book.findMany({
            include:{
                issues:true
            },
            take:10
        })
        return NextResponse.json({status:200,books});
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
    
}