const url = "http://localhost:5000/addMessage";
const data = {
  email: "asd@asd.com",
  nombre: "Marcelito",
  celular: "341029",
  text: "Hola, este mensaje es pa jodé",
};

fetch(url, {
  method: "POST", // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((response) => console.log(response))
  .catch((error) => console.error("Error:", error));
