// components/user/InputData.js
import React, { useState } from 'react';

function InputData() {
  const [formData, setFormData] = useState({ title: '', purpose: '', tools: '', procedure: '', result: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    // Logic untuk submit data ke backend
  };

  return (
    <div>
      <h2>Input Data</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Judul:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <br />
        <label>
          Tujuan:
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} />
        </label>
        <br />
        <label>
          Alat/Bahan:
          <textarea name="tools" value={formData.tools} onChange={handleChange}></textarea>
        </label>
        <br />
        <label>
          Prosedur:
          <textarea name="procedure" value={formData.procedure} onChange={handleChange}></textarea>
        </label>
        <br />
        <label>
          Hasil:
          <textarea name="result" value={formData.result} onChange={handleChange}></textarea>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default InputData;
