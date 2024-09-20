const { useState } = React;

function App() {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [root, setRoot] = useState(""); // State for dropdown value
    const [notes, setNotes] = useState([]); // State for selected notes
    // Set the default tuning to standard EADGBE
    const [tuning, setTuning] = useState([4, 9, 2, 7, 11, 4]); // Standard EADGBE tuning values

    // Handle checkbox change
    const handleNoteChange = (event) => {
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
            const response = await fetch('https://localhost:44387/fretboard/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notes: notes, // Use the selected notes
                    tuning: tuning, // Use the selected tuning
                    root: parseInt(root, 10), // Use the selected root value
                    value: 'interval'
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

    return (
        <div className="container">
            <div className="selectbox">
                <label>Root</label>
                <select
                    id="root"
                    value={root}
                    onChange={(e) => setRoot(e.target.value)}
                >
                    <option disabled value="">---</option>
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
            </div>

            <div className="notes">
                <label>Notes</label>
                {['E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb'].map((note, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            value={index}
                            onChange={handleNoteChange}
                        />
                        <span>{note}</span>
                    </label>
                ))}
            </div>

            <div className="tuning">
                <label>Tuning</label>
                {['E', 'A', 'D', 'G', 'B', 'E'].map((defaultNote, i) => (
                    <select
                        key={i}
                        value={tuning[i]}
                        onChange={(e) => handleTuningChange(i, e.target.value)}
                    >
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
                ))}
            </div>

            <button
                onClick={fetchImage}
                disabled={loading || root === "" || notes.length === 0}
            >
                {loading ? 'Loading...' : 'Show'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {imageUrl && (
                <div className="image-container">
                    <img src={imageUrl} alt="Fetched" />
                </div>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);