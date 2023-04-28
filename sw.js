self.addEventListener("push", (e) => {
  console.log("Service worker loaded");
  const data = e.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
  };

  e.waitUntil(self.registration.showNotification(title, options));
});
