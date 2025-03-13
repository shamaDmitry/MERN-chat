import { useEffect, useState } from "react";
import { UserListItem } from "@/components/user/UserListItem";
import { useRoomsStore } from "@/store/useRoomsStore";
import { useAuthStore } from "@/store/useAuthStore";

export const UserList = ({ roomId }) => {
  const [users, setUsers] = useState([]);
  const { getRoom } = useRoomsStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getRoom(roomId).then((room) => {
      setUsers(room.users);
    });
  }, [getRoom, roomId]);

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserListItem
          key={user._id}
          currentUser={user}
          isOnline={onlineUsers.includes(user._id)}
        />
      ))}
    </div>
  );
};
