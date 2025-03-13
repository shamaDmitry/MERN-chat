import { Users } from "lucide-react";

import { NavLink } from "react-router-dom";

export const RoomCard = ({ room }) => {
  return (
    <div className="overflow-hidden">
      <div className="pb-2">
        <div className="flex justify-between items-start">
          <div className="text-xl">{room.name}</div>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground line-clamp-2 h-12">
          {room.description || "No description provided"}
        </p>
      </div>

      <div className="flex justify-between border-t p-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />

          <span className="text-sm">
            <span className="text-muted-foreground">
              {room.users.length} total
            </span>
          </span>
        </div>

        <NavLink
          className="btn btn-primary btn-sm font-bold"
          to={`/rooms/${room._id}`}
        >
          Join
        </NavLink>
      </div>
    </div>
  );
};
