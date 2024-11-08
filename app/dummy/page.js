"use client"
import React, { useState } from 'react';

const CheckboxInputs = () => {
  // Step 1: State for the inputs and checkbox
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [checked, setChecked] = useState(false);

  // Step 2: Handle checkbox change
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  // Step 3: Handle input changes
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <div>
      <label>
        <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
        Show values in second set
      </label>

      {/* First set of inputs */}
      <div>
        <h3>Input Set 1</h3>
        <input
          type="text"
          value={input1}
          onChange={(e) => handleInputChange(e, setInput1)}
          placeholder="Enter value 1"
        />
        <input
          type="text"
          value={input2}
          onChange={(e) => handleInputChange(e, setInput2)}
          placeholder="Enter value 2"
        />
        <input
          type="text"
          value={input3}
          onChange={(e) => handleInputChange(e, setInput3)}
          placeholder="Enter value 3"
        />
      </div>

      {/* Second set of inputs */}
      <div>
        <h3>Input Set 2</h3>
        <input
          type="text"
          value={checked ? input1 : ''}
          onChange={(e) => handleInputChange(e, setInput1)} // For consistency, keep the same setter
          placeholder={checked ? input1 : 'Enter value 1'}
        />
        <input
          type="text"
          value={checked ? input2 : ''}
          onChange={(e) => handleInputChange(e, setInput2)}
          placeholder={checked ? input2 : 'Enter value 2'}
        />
        <input
          type="text"
          value={checked ? input3 : ''}
          onChange={(e) => handleInputChange(e, setInput3)}
          placeholder={checked ? input3 : 'Enter value 3'}
        />
      </div>
    </div>
  );
};

export default CheckboxInputs;
