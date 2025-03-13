import { useEffect } from "react";
import { useRoomsStore } from "@/store/useRoomsStore";
import { RoomCard } from "@/components/pages/rooms/RoomCard";

export function RoomList() {
  const { rooms, getRooms, isRoomsLoading } = useRoomsStore();

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  if (isRoomsLoading) {
    return (
      <div className="loading loading-dots">
        <span className="sr-only">Loading rooms...</span>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No chat rooms found</h3>
        <p className="text-muted-foreground mt-2">
          Create a new room to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        return <RoomCard key={room._id} room={room} />;
      })}
    </div>
  );
}
