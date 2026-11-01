
export type Activity = {
  id: number;
  type: "client" | "campaign" | "lead";
  action: "created" | "updated" | "deleted";
  description: string;
  date: string;
  entityName?: string;
};

const STORAGE_KEY = "growthflow_activities";
const READ_KEY = "growthflow_read_notifications";

export function getActivities(): Activity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? (JSON.parse(data) as Activity[]) : [];
  } catch {
    return [];
  }
}

export function logActivity(
  type: Activity["type"],
  action: Activity["action"],
  description: string
) {
  const activities = getActivities();

  const newActivity: Activity = {
    id: Date.now(),
    type,
    action,
    description,
    date: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newActivity, ...activities].slice(0, 50))
  );

  window.dispatchEvent(new Event("growthflow:data-updated"));
}

export function getReadNotifications(): number[] {
  try {
    const data = localStorage.getItem(READ_KEY);

    return data ? (JSON.parse(data) as number[]) : [];
  } catch {
    return [];
  }
}

export function markNotificationAsRead(id: number) {
  const readIds = getReadNotifications();

  if (!readIds.includes(id)) {
    localStorage.setItem(
      READ_KEY,
      JSON.stringify([...readIds, id])
    );
  }
}

export function markAllNotificationsAsRead() {
  const allIds = getActivities().map((activity) => activity.id);

  localStorage.setItem(READ_KEY, JSON.stringify(allIds));
}

export function deleteNotification(id: number) {
  const activities = getActivities().filter(
    (activity) => activity.id !== id
  );

  const readIds = getReadNotifications().filter(
    (readId) => readId !== id
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  localStorage.setItem(READ_KEY, JSON.stringify(readIds));

  window.dispatchEvent(new Event("growthflow:data-updated"));
}
