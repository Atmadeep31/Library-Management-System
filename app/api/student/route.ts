import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest,NextResponse } from "next/server";


export async function POST(req:NextRequest){
    const {userId} = await auth();
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401});
}
    try {
        const body = await req.json();
        const {studentCode,name,stream,year} = body;
        const existingStudent = await prisma.student.findUnique({
            where:{
                studentCode,
            }
        })
        if(existingStudent) return NextResponse.json({message:"student with same ID already exists"}, { status: 409 })
        const newStudent = await prisma.student.create({
            data:{
                studentCode,
                name,
                stream,
                year :Number(year)
            }
        })
        return NextResponse.json({message:"Student info inserted into system",student:newStudent})
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
          );
    }
}

export async function GET(req:NextRequest){
    const {userId} = await auth();
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401});
}
    try {
        const students = await prisma.student.findMany({
            include:{
                issues:true
            },
            take:10
        })
        return NextResponse.json({status:200,students})
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
          );
    }
}

export async function PATCH(req:NextRequest){
    const {userId} = await auth();
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401});
}
    try {
        const body = await req.json();
        const {studentCode,year} = body;
        const existingStudent = await prisma.student.findUnique({
            where:{
                studentCode,
            }
        })
        if(existingStudent){
            await prisma.student.update({
                where:{
                    studentCode
                },
                data:{
                    year :Number(year)
                }
            })
            return NextResponse.json({message:"student updated successfully"},{status:200});
        }
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
          );
    }
}