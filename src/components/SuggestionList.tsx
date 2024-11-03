import { Medicine } from "../types/Api"

interface Props {
    medicineSuggestions: Medicine[];
    handleMedicineSelect: (medicine: Medicine) => void;
}

export const SuggestionList = (props: Props) => {
    const { medicineSuggestions, handleMedicineSelect } = props
    return (
        <div className="absolute z-10 w-full mr-6 bg-white border border-gray-300 rounded shadow-lg mt-1">
          {medicineSuggestions.length > 0 ? (
            <ul>
              {medicineSuggestions.map((medicine) => (
                <li
                  key={medicine.id}
                  className="p-2 cursor-pointer hover:bg-gray-200 transition duration-200"
                  onClick={() => handleMedicineSelect(medicine)}
                >
                  {medicine.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-gray-500">No results found</div>
          )}
        </div>
    )
}