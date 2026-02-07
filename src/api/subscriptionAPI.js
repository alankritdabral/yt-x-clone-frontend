const API = import.meta.env.VITE_API_BASE_URL;

export const toggleSubscription = async (channelId) => {
  const res = await fetch(
    `${API}/subscriptions/toggle/${channelId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Subscription failed");
};
