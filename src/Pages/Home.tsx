import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, ITEMS_PER_PAGE_OPTIONS } from "../constants/constants";
import { Medicine } from "../types/Api";
import MedicineModal from "../components/MedicineModal";
import { SuggestionList } from "../components/SuggestionList";
import { MedicineRow } from "../components/MedicineRow";

export default function Home() {
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicineSuggestions, setMedicineSuggestions] = useState<Medicine[]>([]);
  const [searchButtonPressed, setSearchButtonPressed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  const getAllMedicines = async () => {
    if (!currentPage || !itemsPerPage) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/medicines`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
        },
      });
      setAllMedicines(response.data.medicines);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const getSearchResults = async () => {
    if (!searchTerm) return; // Add this check
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/medicines/search?query=${searchTerm}`,
        {
          params: {
            page: currentPage,
            size: itemsPerPage,
          },
        }
      );
      setAllMedicines(response.data.medicines);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const getMedicineSuggestions = async (term: string) => {
    if (!term.trim()) {
      setMedicineSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/medicines/search?query=${term}`
      );
      setMedicineSuggestions(response.data.medicines);
    } catch (error) {
      console.error("Error fetching medicine suggestions:", error);
    }
  };

  useEffect(() => {
    if (searchButtonPressed) {
      getSearchResults();
    } else {
      getAllMedicines();
    }
    setCurrentPage(window.location.search.includes("page=") ? Number(new URLSearchParams(window.location.search).get("page")) : 1);
    setItemsPerPage(window.location.search.includes("size=") ? Number(new URLSearchParams(window.location.search).get("size")) : 10);
  }, [currentPage, itemsPerPage, searchButtonPressed]);

  useEffect(() => {
    getMedicineSuggestions(searchTerm);
  }, [searchTerm]);

  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.history.pushState({}, "", `?page=${page}&size=${itemsPerPage}`);
  };

  const handleSearchClick = () => {
    setSearchButtonPressed(true);
    setCurrentPage(1);
    window.history.pushState({}, "", `?page=${1}&size=${itemsPerPage}`);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    window.history.pushState({}, "", `?page=1&size=${event.target.value}`);
    setCurrentPage(1);
  };

  return (
    <div className="relative m-6">
      <h1 className="text-3xl font-bold mb-4">Medicine Search</h1>
      <div className="flex">
        <input
          type="text"
          placeholder="Search for a medicine..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value.trim()) {
              setSearchButtonPressed(false); // Reset when input is cleared
            } else {
              setSearchButtonPressed(false); // Reset so suggestions can show
            }
          }}
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          onClick={handleSearchClick}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 transition duration-200"
        >
          Search
        </button>
      </div>

      {/* Suggestions List */}
      {searchTerm && !searchButtonPressed && (
        <SuggestionList
          medicineSuggestions={medicineSuggestions}
          handleMedicineSelect={handleMedicineSelect}
        />
      )}
      {allMedicines.length === 0 ? (
        <div className="text-gray-500 mt-4">No results found</div>
      ) : (
        <>
          {/* All Medicines List */}
          <h2 className="text-xl font-semibold mt-4">All Medicines</h2>
          <ul className="space-y-1">
            {allMedicines.map((medicine) => (
              <MedicineRow
                key={medicine.id}
                medicine={medicine}
                handleMedicineSelect={handleMedicineSelect}
              />
            ))}
          </ul>

          {/* Items Per Page Dropdown */}
          <div className="mt-4">
            <label className="mr-2">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
            </span>
            <button
              disabled={currentPage * itemsPerPage >= totalItems}
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal for Medicine Details */}
      <MedicineModal medicine={selectedMedicine} onClose={closeModal} />
    </div>
  );
}
