import { Medicine } from "../types/Api";

interface Props {
  medicine: Medicine;
  handleMedicineSelect: (medicine: Medicine) => void;
}

export const MedicineRow = (props: Props) => {
  const { medicine, handleMedicineSelect } = props;
  return (
    <li
      key={medicine.id}
      className="p-2 cursor-pointer border border-gray-300 rounded hover:bg-gray-200 transition duration-200"
      onClick={() => handleMedicineSelect(medicine)}
    >
      {medicine.name}
    </li>
  );
};
