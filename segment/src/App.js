import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);

  const [schemaToAdd, setSchemaToAdd] = useState('');

  // Handles schema selection
  const handleSchemaSelect = (e) => {
    const selectedValue = e.target.value;
    setSchemaToAdd(selectedValue);
  };

  // Handles adding a new schema to the list
  const handleAddSchema = () => {
    if (schemaToAdd === '') return; // Don't add empty schema

    const selectedSchema = availableSchemas.find((schema) => schema.value === schemaToAdd);

    setSelectedSchemas([...selectedSchemas, selectedSchema]);
    setAvailableSchemas(availableSchemas.filter((schema) => schema.value !== schemaToAdd));

    // Reset the dropdown for next schema selection
    setSchemaToAdd('');
  };

  // Function to convert object to query string
  const objectToQueryString = (obj) => {
    return Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  };

  // Handle saving the segment with a GET request
  const handleSaveSegment = async () => {
    const schemaData = selectedSchemas.map((schema) => `${schema.value}:${schema.label}`).join(',');
    
    // Creating query parameters for the GET request
    const queryParams = objectToQueryString({
      segment_name: segmentName,
      schema: schemaData,
    });

    const url = `https://webhook.site/e469b4c9-331a-42c0-8f0d-becd3cba0fcd?${queryParams}`;

    console.log('GET URL:', url); // Debug log

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      console.log('Segment saved:', response);
    } catch (error) {
      console.error('Error saving segment:', error);
    }

    // Reset modal and form after saving
    setShowModal(false);
    setSegmentName('');
    setSelectedSchemas([]);
    setAvailableSchemas([
      { label: 'First Name', value: 'first_name' },
      { label: 'Last Name', value: 'last_name' },
      { label: 'Gender', value: 'gender' },
      { label: 'Age', value: 'age' },
      { label: 'Account Name', value: 'account_name' },
      { label: 'City', value: 'city' },
      { label: 'State', value: 'state' },
    ]);
  };

  return (
    <div className="App">
      <button onClick={() => setShowModal(true)}>Save segment</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Saving Segment</h3>

            {/* Input for segment name */}
            <input
              type="text"
              placeholder="Enter the Name of the Segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />

            {/* Show selected schemas in a blue box */}
            <div className="schema-box" style={{ border: '1px solid blue', padding: '10px' }}>
              {selectedSchemas.length === 0 ? (
                <p>No schema added yet</p>
              ) : (
                selectedSchemas.map((schema, index) => (
                  <p key={index}>{schema.label}</p>
                ))
              )}
            </div>

            {/* Dropdown to select schema */}
            <select value={schemaToAdd} onChange={handleSchemaSelect}>
              <option value="">Add schema to segment</option>
              {availableSchemas.map((schema) => (
                <option key={schema.value} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>

            {/* Button to add schema */}
            <button onClick={handleAddSchema}>+ Add new schema</button>

            {/* Button to save segment */}
            <button onClick={handleSaveSegment}>Save the Segment</button>

            {/* Button to close the modal */}
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
