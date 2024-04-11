const sayhey = document.querySelector("h1");

window.addEventListener("click", async () => {
  try {
    const response = await fetch("/profile");
    const data = await response.json();
    sayhey.innerText = `Welcome ${data.first_name}`;
  } catch (error) {
    console.error(error);
  }
});
