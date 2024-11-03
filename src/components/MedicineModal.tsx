import { Medicine } from "../types/Api";

interface Props {
    medicine: Medicine | null;
    onClose: () => void;
}

const MedicineModal = (props: Props) => {
    const { medicine, onClose } = props;
    if (!medicine) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold">{medicine.name}</h2>
          <p className="mt-2"><strong>Price:</strong> Rs. {medicine.price.toFixed(2)}</p>
          <p><strong>Manufacturer:</strong> {medicine.manufacturer_name}</p>
          <p><strong>Type:</strong> {medicine.type}</p>
          <p><strong>Pack Size:</strong> {medicine.pack_size_label}</p>
          <p><strong>Composition:</strong> {medicine.short_composition1} {medicine.short_composition2 || ''}</p>
          <button onClick={onClose} className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
            Close
          </button>
        </div>
      </div>
    );
  };

  export default MedicineModal;