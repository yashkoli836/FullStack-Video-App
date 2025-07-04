import { dbConnect } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"; // Adjust the path if your authOptions are located elsewhere
import { error } from "console";

export async function GET(){
    try{
        await dbConnect()
        const videos = await Video.find({}).sort({createdAt: -1}).lean()

        if(!videos || videos.length ===0){
            return NextResponse.json([],{status:200})
        
        }

        return NextResponse.json(videos)
    }
    catch(e){
        return NextResponse.json(
            {error: "Failed to fetch videos"},
        {status:500})
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status:401}
            )
        }
        await dbConnect()

        const body:IVideo = await request.json()
        if(
            !body.title || 
            !body.description||
            !body.videoUrl||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Missing required fields"},
                {status:401}
            )
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height:1920,
                width:1080,
                quality:body.transformation?.quality ?? 100,
            }
        }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json(
                {error: "failed to create video"},
                {status:500}
            )
    }
}