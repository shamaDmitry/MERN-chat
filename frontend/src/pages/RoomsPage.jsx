import { Headline } from "@/components/Headline";
import { Plus } from "lucide-react";
import { RoomList } from "@/components/pages/rooms/RoomList";

export const RoomsPage = () => {
  return (
    <div className="container">
      <div className="flex gap-4 justify-between mb-5">
        <Headline>Rooms</Headline>

        <button className="btn btn-primary btn-sm">
          <Plus className="size-4" />
          Create Room
        </button>
      </div>

      <RoomList />
    </div>
  );
};
