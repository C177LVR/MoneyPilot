import type { Metadata } from "next";
import { requireAdminUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import {
  NotificationManager,
  type NotificationView,
} from "@/components/admin/notification-manager";

export const metadata: Metadata = {
  title: "Admin — Notifications",
  robots: { index: false, follow: false },
};

export default async function AdminNotificationsPage() {
  await requireAdminUserId();
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const view: NotificationView[] = notifications.map((n) => ({
    id: n.id,
    message: n.message,
    active: n.active,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NotificationManager notifications={view} />;
}
