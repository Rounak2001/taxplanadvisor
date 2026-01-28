import { motion } from 'framer-motion';
import Availability from '@/components/consultations/Availability';
import { MeetingsList } from '@/components/client/MeetingsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Consultations() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Consultations</h1>
          <p className="text-muted-foreground mt-1">Manage your availability and upcoming meetings</p>
        </div>

        <Tabs defaultValue="meetings" className="w-full">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="meetings">Upcoming Meetings</TabsTrigger>
            <TabsTrigger value="availability">Availability Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings" className="mt-6">
            <MeetingsList />
          </TabsContent>

          <TabsContent value="availability" className="mt-6">
            <Availability />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
