import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
  const {userId} = await auth();
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401});
}
  try {
    const transactions = await prisma.issue.findMany({
      include:{
        student:true,
        book:true
      },
      take:10,
      orderBy: { issueDate: 'desc' }
    })
    return NextResponse.json({transactions});
  } catch (error) {
    return NextResponse.json({message:"Something went wrong"},{status:500})
  }
}

export async function POST(req: NextRequest) {
  const {userId} = await auth();
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401});
}
  try {
    const body = await req.json();

    const { studentCode, bookCode, dueDate } = body;

    // Check student exists
    const student = await prisma.student.findUnique({
      where: {
        studentCode: studentCode,
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Check book exists
    const book = await prisma.book.findUnique({
      where: {
        bookCode: bookCode,
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    // Check availability
    if (book.availableQuantity <= 0) {
      return NextResponse.json(
        { message: "Book unavailable" },
        { status: 400 }
      );
    }

    // Check existing issued book
    const existingEntry = await prisma.issue.findFirst({
        where: { 
            studentId: student.id,
            bookId: book.id,
            status: "ISSUED" 
            },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "A book has already been issued" },
        { status: 400 }
      );
    }

    // Transaction
    await prisma.$transaction([
      prisma.issue.create({
        data: {
          studentId:student.id,
          bookId:book.id,
          dueDate: new Date(dueDate),
          status: "ISSUED",
        },
      }),

      prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          availableQuantity: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Book issued successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const {userId} = await auth();
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401});
}
  try {
    const body = await req.json();

    const { studentCode, bookCode } = body;

    // Find student using studentCode
    const student = await prisma.student.findUnique({
      where: {
        studentCode: studentCode,
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Find book using bookCode
    const book = await prisma.book.findUnique({
      where: {
        bookCode: bookCode,
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }

    // Find active issue entry
    const existingEntry = await prisma.issue.findFirst({
      where: {
        studentId: student.id,
        bookId: book.id,
        status: "ISSUED",
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { message: "No active issued record found" },
        { status: 404 }
      );
    }

    const today = new Date();

    // Fine calculation
    let fine = 0;

    if (today > existingEntry.dueDate) {
      const lateDays = Math.ceil(
        (today.getTime() - existingEntry.dueDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      fine = lateDays * 5; // ₹5 per day
    }

    // Transaction
    await prisma.$transaction([
      prisma.issue.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          status: "RETURNED",
          returnDate: today,
        },
      }),

      prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          availableQuantity: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Book returned successfully",
      fine,
      studentName: student.name
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}