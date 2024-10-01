const { useState } = React;

function App() {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [root, setRoot] = useState("");
    const [notes, setNotes] = useState([]);
    const [tuning, setTuning] = useState([0, 5, 10, 3, 7, 0]);
    const [type, setType] = useState('interval');

    // Handle checkbox change
    const handleNoteChange = (event) => {
        console.log(event.target.value);
        const value = parseInt(event.target.value, 10);
        setNotes(prevNotes =>
            event.target.checked
                ? [...prevNotes, value] // Add value if checked
                : prevNotes.filter(note => note !== value) // Remove value if unchecked
        );
    };

    // Handle tuning change
    const handleTuningChange = (index, value) => {
        const newTuning = [...tuning];
        newTuning[index] = parseInt(value, 10);
        setTuning(newTuning);
    };

    const fetchImage = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/fretboard/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notes: notes, // Use the selected notes
                    tuning: tuning, // Use the selected tuning
                    root: parseInt(root, 10), // Use the selected root value
                    value: type
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const imageData = await response.text();
            setImageUrl(imageData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const tuningNote = (initialValue, onChange, allowEmpty) => {
        const [selectedValue, setSelectedValue] = useState(initialValue);

        const onValueChange = (e) => {
            const val = e.target.value;
            setSelectedValue(val);
            onChange(val);
        }

        return (
            <select value={selectedValue} onChange={onValueChange}>
                { allowEmpty && <option disabled value="">---</option>}
                <option value="0">E</option>
                <option value="1">F</option>
                <option value="2">F#/Gb</option>
                <option value="3">G</option>
                <option value="4">G#/Ab</option>
                <option value="5">A</option>
                <option value="6">A#/Bb</option>
                <option value="7">B</option>
                <option value="8">C</option>
                <option value="9">C#/Db</option>
                <option value="10">D</option>
                <option value="11">D#/Eb</option>
            </select>
        )
    }

    const handleTypeChange = (event) => {
        console.log(event);
        setType(event.target.value);
    };

    return (
        <div id="app">
        <div className="tuning">
          <span>Tuning </span>
          {tuning.map((defaultNote, i) => tuningNote(defaultNote, (val) => handleTuningChange(i, val), false))}
        </div>
    
        <div className="notes">
          <input type="checkbox" id="E" name="E" value="0" onChange={handleNoteChange}/><span>E</span>
          <input type="checkbox" id="F" name="F" value="1" onChange={handleNoteChange} /><span>F</span>
          <input type="checkbox" id="Gb" name="Gb" value="2" onChange={handleNoteChange} /><span>F#/Gb</span>
          <input type="checkbox" id="G" name="G" value="3" onChange={handleNoteChange} /><span>G</span>
          <input type="checkbox" id="Ab" name="Ab" value="4" onChange={handleNoteChange} /><span>G#/Ab</span>
          <input type="checkbox" id="A" name="A" value="5" onChange={handleNoteChange} /><span>A</span>
          <input type="checkbox" id="Bb" name="Bb" value="6" onChange={handleNoteChange} /><span>A#/Bb</span>
          <input type="checkbox" id="B" name="B" value="7" onChange={handleNoteChange} /><span>B</span>
          <input type="checkbox" id="C" name="C" value="8" onChange={handleNoteChange} /><span>C</span>
          <input type="checkbox" id="Db" name="Db" value="9" onChange={handleNoteChange} /><span>C#/Db</span>
          <input type="checkbox" id="D" name="D" value="10" onChange={handleNoteChange} /><span>D</span>
          <input type="checkbox" id="Eb" name="Eb" value="11" onChange={handleNoteChange} /><span>D#/Eb</span>
        </div>
    
      <div className="selectbox" >
        <span>Root </span>
        {tuningNote("", setRoot, true)}
      </div>
    
      <div className="value">
        <input type="radio" id="note" name="value" value="note" checked={type === "note"} onChange={handleTypeChange} />
        <label htmlFor="male">Note</label>
        <input type="radio" id="interval" name="value" value="interval" checked={type === "interval"} onChange={handleTypeChange} />
        <label htmlFor="female">Interval</label>
      </div>
    
      <button className="button" onClick={fetchImage} disabled={loading || root === "" || notes.length === 0}>
        Show
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {imageUrl && (
        <div className="image-container">
            <img src={imageUrl} alt="Fetched" />
        </div>
      )}

      { loading && <img className="spinner" src="./images/spinner.gif" /> }

      </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);