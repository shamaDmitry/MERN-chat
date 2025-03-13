import { Headline } from "@/components/Headline";
import { RoomDetail } from "@/components/pages/rooms/RoomDetail";
import { ChevronLeft } from "lucide-react";
import { Suspense, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import { useRoomsStore } from "@/store/useRoomsStore";
import { useState } from "react";

export const RoomPage = () => {
  const { roomId } = useParams();
  const { getRoom } = useRoomsStore();
  const [data, setData] = useState(null);

  useEffect(() => {
    getRoom(roomId).then((res) => {
      setData(res);
    });
  }, [getRoom, roomId]);

  if (data) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-5 flex gap-4 justify-between items-center">
          <NavLink className="btn btn-primary btn-sm" to="/rooms">
            <ChevronLeft className="size-4" />
            Back to Rooms
          </NavLink>

          <button className="btn btn-error btn-sm">Leave Room</button>
        </div>

        <div className="flex items-center mb-5">
          <Headline>{data.name}</Headline>
        </div>

        <Suspense fallback={<div>loading</div>}>
          <RoomDetail roomId={roomId} />
        </Suspense>
      </div>
    );
  }
};
