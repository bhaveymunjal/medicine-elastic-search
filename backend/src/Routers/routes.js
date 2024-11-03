const MedicineController = require("../Controllers/medicine.controller");
const { Router } = require("express");

const routes = Router();

routes.get("/", (req, res) => {
  res.json({ message: "Welcome to Medicine Search API" });
});

routes.get("/api/medicines", MedicineController.getAllMedicines);

routes.get("/api/medicines/search", MedicineController.searchMedicines);

routes.get("/api/medicine/:id", MedicineController.getMedicineById);


module.exports = routes;
