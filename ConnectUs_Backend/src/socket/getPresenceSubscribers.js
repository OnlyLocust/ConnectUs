import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export async function getPresenceSubscribers(userId) {
  try {
    const user = await User.findById(userId)
      .select("followers following");

    const followers =
      user?.followers?.map(f => f.toString()) || [];

    const following =
      user?.following?.map(f => f.toString()) || [];

    const chats = await Chat.find({
      members: userId,
    }).select("members");

    const chatPartners = chats.flatMap(chat =>
      chat.members
        .map(m => m.toString())
        .filter(m => m !== userId)
    );

    return [...new Set([
      ...followers,
      ...following,
      ...chatPartners,
    ])];
  } catch (err) {
    console.error(err);
    return [];
  }
}