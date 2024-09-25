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

  const handleSchemaSelect = (e) => {
    const selectedValue = e.target.value;
    setSchemaToAdd(selectedValue);
  };

  const handleAddSchema = () => {
    if (schemaToAdd === '') return;

    const selectedSchema = availableSchemas.find((schema) => schema.value === schemaToAdd);

    setSelectedSchemas([...selectedSchemas, selectedSchema]);
    setAvailableSchemas(availableSchemas.filter((schema) => schema.value !== schemaToAdd));

    setSchemaToAdd('');
  };

  const objectToQueryString = (obj) => {
    return Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  };

  const handleSaveSegment = async () => {
    const schemaData = selectedSchemas.map((schema) => `${schema.value}:${schema.label}`).join(',');

    const queryParams = objectToQueryString({
      segment_name: segmentName,
      schema: schemaData,
    });

    const url = `https://webhook.site/e469b4c9-331a-42c0-8f0d-becd3cba0fcd?${queryParams}`;

    console.log('GET URL:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      console.log('Segment saved:', response);
    } catch (error) {
      console.error('Error saving segment:', error);
    }

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

            <input
              type="text"
              placeholder="Enter the Name of the Segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />

            <div className="schema-box" style={{ border: '1px solid blue', padding: '10px' }}>
              {selectedSchemas.length === 0 ? (
                <p>No schema added yet</p>
              ) : (
                selectedSchemas.map((schema, index) => (
                  <p key={index}>{schema.label}</p>
                ))
              )}
            </div>

            <select value={schemaToAdd} onChange={handleSchemaSelect}>
              <option value="">Add schema to segment</option>
              {availableSchemas.map((schema) => (
                <option key={schema.value} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>

            <button onClick={handleAddSchema}>+ Add new schema</button>

            <button onClick={handleSaveSegment}>Save the Segment</button>

            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
