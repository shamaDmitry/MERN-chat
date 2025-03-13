import { Headline } from "@/components/Headline";

export const RoomDetail = () => {
  return (
    <div>
      <div className="tabs tabs-border">
        <input
          defaultChecked
          type="radio"
          name="tabs"
          className="tab"
          aria-label="Chat"
        />

        <div className="tab-content bg-base-100 py-5">
          <Headline className="mb-5" tag="h2">
            Chat
          </Headline>

          <div className="border border-base-300 rounded-lg flex items-center justify-center capitalize font-bold h-80 p-5 shadow-xl">
            chat
          </div>
        </div>

        <input type="radio" name="tabs" className="tab" aria-label="Users" />
        <div className="tab-content bg-base-100 py-5">
          <Headline className="mb-5" tag="h2">
            Users list
          </Headline>

          <div className="border border-base-300 rounded-lg min-h-80 p-5 shadow-xl">
            Users
          </div>
        </div>
      </div>
    </div>
  );
};

// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UserList } from "@/components/user-list"
// import type { Room } from "@/lib/types"
// import { getRoom } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// interface RoomDetailProps {
//   roomId: string
//   initialRoom: Room
// }

// export function RoomDetail({ roomId, initialRoom }: RoomDetailProps) {
//   const [room, setRoom] = useState<Room>(initialRoom)
//   const { toast } = useToast()

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const updatedRoom = await getRoom(roomId)
//         setRoom(updatedRoom)
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to refresh room data",
//           variant: "destructive",
//         })
//       }
//     }, 10000) // Refresh every 10 seconds

//     return () => clearInterval(interval)
//   }, [roomId, toast])

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">{room.name}</h1>
//           <p className="text-muted-foreground mt-1">{room.description || "No description provided"}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge
//             variant={room.isActive ? "default" : "secondary"}
//             className={room.isActive ? "bg-green-500 hover:bg-green-600" : ""}
//           >
//             {room.isActive ? "Active" : "Inactive"}
//           </Badge>
//           <Badge variant="outline">
//             {room.onlineUsers} online / {room.totalUsers} total
//           </Badge>
//         </div>
//       </div>

//       <Tabs defaultValue="chat" className="w-full">
//         <TabsList className="grid w-full md:w-[400px] grid-cols-2">
//           <TabsTrigger value="chat">Chat</TabsTrigger>
//           <TabsTrigger value="users">Users</TabsTrigger>
//         </TabsList>
//         <TabsContent value="chat" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Chat</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px] border rounded-md p-4 flex items-center justify-center">
//                 <p className="text-muted-foreground">Chat functionality would be implemented here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="users" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <UserList roomId={roomId} />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
