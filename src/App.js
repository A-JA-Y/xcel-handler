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
    
//     add a column named "Zone" to the sheet and set the value of the cell value to  =IF(OR(N2="West Bengal", N2="Jharkhand", N2="Sikkim", N2="Uttar Pradesh", N2="Assam", N2="Bihar", N2="Arunachal Pradesh", N2="Chattisgarh", N2="Delhi", N2="Haryana", N2="Jammu and Kashmir", N2="Odisha", N2="Punjab", N2="Rajasthan", N2="Tripura"), "Ajay",
// IF(OR(N2="Tamil Nadu", N2="Karnataka", N2="Pondicherry", N2="Andhra Pradesh", N2="Telangana", N2="Goa"), "Vishal",
// IF(OR(N2="Maharashtra", N2="Gujarat", N2="Madhya Pradesh", N2="Mumbai", N2="Dadra and Nagar Hav."), "Neeraj", "NA")))

    const newSheet = XLSX.utils.aoa_to_sheet( [ ["Zone", ...Object.keys(fileContent[0])], ...fileContent.map( (row) => {
      return ["=IF(OR(N2=\"West Bengal\", N2=\"Jharkhand\", N2=\"Sikkim\", N2=\"Uttar Pradesh\", N2=\"Assam\", N2=\"Bihar\", N2=\"Arunachal Pradesh\", N2=\"Chattisgarh\", N2=\"Delhi\", N2=\"Haryana\", N2=\"Jammu and Kashmir\", N2=\"Odisha\", N2=\"Punjab\", N2=\"Rajasthan\", N2=\"Tripura\"), \"Ajay\", IF(OR(N2=\"Tamil Nadu\", N2=\"Karnataka\", N2=\"Pondicherry\", N2=\"Andhra Pradesh\", N2=\"Telangana\", N2=\"Goa\"), \"Vishal\", IF(OR(N2=\"Maharashtra\", N2=\"Gujarat\", N2=\"Madhya Pradesh\", N2=\"Mumbai\", N2=\"Dadra and Nagar Hav.\"), \"Neeraj\", \"NA\")))", ...Object.values(row)];
    })]);
    

    // Write the file if needed
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
    XLSX.writeFile(newWorkbook, "output.xlsx");
    
  };

  return (
    <div className="App">
      <h1>Set Zones</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" required onChange={handleFileUpload} />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

export default App;
