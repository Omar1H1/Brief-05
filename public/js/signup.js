window.addEventListener("load", async () => {
  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", async (event) => {
    const formData = new FormData(formEl);
    const { first_name, last_name, email, password } =
      Object.fromEntries(formData);

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  });
});
