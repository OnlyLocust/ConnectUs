import { NextResponse } from 'next/server';
import User from '@/models/user.model';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    const id = req.headers.get('userId');
    
    const suggestions = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) } // exclude current user
        }
      },
      { $sample: { size: 6 } },
      {
        $project: {
          username: 1,
          profilePicture: 1
        }
      }
    ]);

    return NextResponse.json({ success: true, suggestions }, { status: 200 });
  } catch (err) {    
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
