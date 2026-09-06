const { useState, useEffect } = React;

const NOTE_LABELS = [
    ['E', '0'], ['F', '1'], ['F#/Gb', '2'], ['G', '3'], ['G#/Ab', '4'], ['A', '5'],
    ['A#/Bb', '6'], ['B', '7'], ['C', '8'], ['C#/Db', '9'], ['D', '10'], ['D#/Eb', '11']
];

function useRoute() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const onPopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const navigate = (to) => {
        window.history.pushState({}, '', to);
        setPath(to);
    };

    return [path, navigate];
}

function NoteSelect({ value, onChange, allowEmpty }) {
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            {allowEmpty && <option disabled value="">---</option>}
            {NOTE_LABELS.map(([label, val]) => (
                <option key={val} value={val}>{label}</option>
            ))}
        </select>
    );
}

function Landing() {
    useEffect(() => {
        document.title = "SKAFANDRAS";
    }, []);

    return <div className="landing" />;
}

function FretsApp({ onBack }) {
    useEffect(() => {
        document.title = "Fret Viz";
    }, []);

    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [root, setRoot] = useState("");
    const [notes, setNotes] = useState([]);
    const [tuning, setTuning] = useState([0, 5, 10, 3, 7, 0]);
    const [type, setType] = useState('interval');

    const handleNoteChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setNotes(prevNotes =>
            event.target.checked
                ? [...prevNotes, value]
                : prevNotes.filter(note => note !== value)
        );
    };

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
                    notes: notes,
                    tuning: tuning,
                    root: parseInt(root, 10),
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

    const handleTypeChange = (event) => setType(event.target.value);

    return (
        <div id="app">
            <a
                className="brand"
                href="/"
                onClick={(e) => { e.preventDefault(); onBack(); }}
            >
                &lt; back
            </a>

            <div className="panel">
                <div className="field">
                    <span className="field-label">Tuning</span>
                    <div className="tuning">
                        {tuning.map((defaultNote, i) => (
                            <NoteSelect
                                key={i}
                                value={defaultNote}
                                onChange={(val) => handleTuningChange(i, val)}
                                allowEmpty={false}
                            />
                        ))}
                    </div>
                </div>

                <div className="field">
                    <span className="field-label">Notes</span>
                    <div className="notes">
                        {NOTE_LABELS.map(([label, value]) => (
                            <label className="note-toggle" key={value}>
                                <input type="checkbox" value={value} onChange={handleNoteChange} />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="field">
                    <span className="field-label">Root</span>
                    <NoteSelect value={root} onChange={setRoot} allowEmpty={true} />
                </div>

                <div className="field value-toggle">
                    <label>
                        <input type="radio" name="value" value="note" checked={type === "note"} onChange={handleTypeChange} />
                        <span>Note</span>
                    </label>
                    <label>
                        <input type="radio" name="value" value="interval" checked={type === "interval"} onChange={handleTypeChange} />
                        <span>Interval</span>
                    </label>
                </div>

                <button
                    className="button"
                    onClick={fetchImage}
                    disabled={loading || root === "" || notes.length === 0}
                >
                    {loading ? 'Loading…' : 'Show'}
                </button>

                {error && <p className="error">Error: {error}</p>}
            </div>

            {loading && <img className="spinner" src="/images/spinner.gif" alt="Loading" />}

            {imageUrl && !loading && (
                <div className="image-container">
                    <img src={imageUrl} alt="Fretboard" />
                </div>
            )}
        </div>
    );
}

function Root() {
    const [path, navigate] = useRoute();

    if (path === '/frets') {
        return <FretsApp onBack={() => navigate('/')} />;
    }

    return <Landing />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
