/**
 * Consultant Messages Page
 * Real-time chat with clients
 */

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ConsultantMessages() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[calc(100vh-8rem)]"
        >
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Client Messages
                </h1>
                <p className="text-muted-foreground mt-1">
                    Chat with your clients in real-time
                </p>
            </div>

            <div className="h-[calc(100%-4rem)] rounded-xl overflow-hidden border border-border">
                <ChatWindow />
            </div>
        </motion.div>
    );
}
