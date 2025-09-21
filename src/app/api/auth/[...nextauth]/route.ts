import { auth } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  return auth(request)
}

export async function POST(request: NextRequest) {
  return auth(request)
}
