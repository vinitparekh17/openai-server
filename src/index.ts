import app from "./app";

app.listen(parseInt(process.env.PORT), () => {
  console.log(`Server started on port ${process.env.PORT}`);
});