import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const [fileContent, setFileContent] = useState([]);
  const [workbook, setWorkbook] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const wb = XLSX.read(data, { type: "array" });
      setWorkbook(wb);
      const firstSheetName = wb.SheetNames[0];
      const worksheet = wb.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setFileContent(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workbook) return;
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const newSheet = XLSX.utils.aoa_to_sheet([
      ["Zone", ...Object.keys(fileContent[0])],
      ...fileContent.map((row) => {
        return [
          '=IF(OR(N2="West Bengal", N2="Jharkhand", N2="Sikkim", N2="Uttar Pradesh", N2="Assam", N2="Bihar", N2="Arunachal Pradesh", N2="Chattisgarh", N2="Delhi", N2="Haryana", N2="Jammu and Kashmir", N2="Odisha", N2="Punjab", N2="Rajasthan", N2="Tripura"), "Ajay", IF(OR(N2="Tamil Nadu", N2="Karnataka", N2="Pondicherry", N2="Andhra Pradesh", N2="Telangana", N2="Goa"), "Vishal", IF(OR(N2="Maharashtra", N2="Gujarat", N2="Madhya Pradesh", N2="Mumbai", N2="Dadra and Nagar Hav."), "Neeraj", "NA")))',
          ...Object.values(row),
        ];
      }),
    ]);

    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
    XLSX.writeFile(newWorkbook, "output.xlsx");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 shadow-md p-4 rounded-xl bg-gray-200
                     hover:shadow-lg transition-shadow duration-300">
        Set Zones
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-inner p-6 rounded-xl space-y-4
                   hover:shadow-lg transition-shadow duration-300"
      >
        <input
          type="file"
          required
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400
                     hover:shadow-md transition-shadow duration-300"
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-500 text-white font-semibold rounded-xl
                     shadow-md hover:bg-indigo-600 hover:shadow-xl transition duration-300"
        >
          submit
        </button>
      </form>
    </div>
  );
}

export default App;
