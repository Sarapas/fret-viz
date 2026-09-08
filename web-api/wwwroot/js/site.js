const { useState, useEffect, useRef } = React;

const NOTE_LABELS = [
    ['E', '0'], ['F', '1'], ['F#/Gb', '2'], ['G', '3'], ['G#/Ab', '4'], ['A', '5'],
    ['A#/Bb', '6'], ['B', '7'], ['C', '8'], ['C#/Db', '9'], ['D', '10'], ['D#/Eb', '11']
];

// Fretboard drawing: ported from the server-side ImageSharp renderer so the
// layout matches the source photo (web-api/wwwroot/images/fretboard-large.png)
// pixel-for-pixel, integer-division quirks included.
const BOARD_IMAGE_SRC = '/images/fretboard-large.png';
const NOTE_NAMES = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
const INTERVAL_LABELS = ['R', 'm2', '2', 'm3', '3', '4', '4#', '5', 'm6', '6', 'm7', '7'];
const FRET_WIDTHS = [20, 142, 200, 190, 178, 170, 158, 152, 137, 134, 122, 120, 112];
const STRING_TOP_OPEN = 92;
const STRING_BOTTOM_OPEN = 286;
const STRING_TOP_FRET12 = 66;
const STRING_BOTTOM_FRET12 = 310;
const NOTE_RADIUS = 18;

function idiv(a, b) {
    return Math.trunc(a / b);
}

function getNoteAt(tuning, fret, str) {
    return (tuning[5 - str] + fret) % 12;
}

function getFretX(fret) {
    let x = 0;
    for (let f = 0; f <= fret; f++) x += FRET_WIDTHS[f];
    return x;
}

function getStringY(fret, str) {
    const top = STRING_TOP_OPEN - idiv(STRING_TOP_OPEN - STRING_TOP_FRET12, 12) * fret;
    const bottom = STRING_BOTTOM_OPEN + idiv(STRING_BOTTOM_FRET12 - STRING_BOTTOM_OPEN, 12) * fret;
    return top + idiv(bottom - top, 5) * str;
}

function drawFretboard(board, { tuning, notes, root, type }) {
    const canvas = document.createElement('canvas');
    canvas.width = board.naturalWidth;
    canvas.height = board.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(board, 0, 0);

    if (notes.length === 0) return canvas.toDataURL('image/png');

    ctx.font = 'bold 19px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let fret = 0; fret <= 12; fret++) {
        for (let str = 0; str < 6; str++) {
            const note = getNoteAt(tuning, fret, str);
            if (!notes.includes(note)) continue;

            const isRoot = note === root;
            const label = type === 'interval'
                ? INTERVAL_LABELS[(note - root + 12) % 12]
                : NOTE_NAMES[note];

            const x = getFretX(fret);
            const y = getStringY(fret, str);

            ctx.beginPath();
            ctx.arc(x, y, NOTE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = isRoot ? '#ff0000' : '#000000';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, x, y);
        }
    }

    return canvas.toDataURL('image/png');
}

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

function NoteSelect({ value, onChange }) {
    return (
        <select value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))}>
            {NOTE_LABELS.map(([label, val]) => (
                <option key={val} value={val}>{label}</option>
            ))}
        </select>
    );
}

function IntervalChip({ label, noteName, checked, fixed, onToggle }) {
    return (
        <label className="interval-toggle">
            <input
                type="checkbox"
                className="interval-toggle-input"
                checked={checked}
                disabled={fixed}
                onChange={onToggle}
            />
            <span className={
                "interval-chip" +
                (checked ? " interval-chip--active" : "") +
                (fixed ? " interval-chip--fixed" : "")
            }>
                <span className="interval-chip-label">{label}</span>
                <span className="interval-chip-note">{noteName}</span>
            </span>
        </label>
    );
}

function SegmentedToggle({ options, value, onChange }) {
    return (
        <div className="segmented" role="radiogroup">
            {options.map(([label, val]) => (
                <button
                    type="button"
                    key={val}
                    className={"segmented-option" + (value === val ? " segmented-option--active" : "")}
                    aria-pressed={value === val}
                    onClick={() => onChange(val)}
                >
                    {label}
                </button>
            ))}
        </div>
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

    const boardImageRef = useRef(null);
    const [boardReady, setBoardReady] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [root, setRoot] = useState(0);
    const [intervals, setIntervals] = useState([0]);
    const [tuning, setTuning] = useState([0, 5, 10, 3, 7, 0]);
    const [type, setType] = useState('interval');

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            boardImageRef.current = img;
            setBoardReady(true);
        };
        img.src = BOARD_IMAGE_SRC;
    }, []);

    const handleIntervalToggle = (offset) => {
        setIntervals(prev =>
            prev.includes(offset)
                ? prev.filter(i => i !== offset)
                : [...prev, offset]
        );
    };

    const handleTuningChange = (index, value) => {
        const newTuning = [...tuning];
        newTuning[index] = value;
        setTuning(newTuning);
    };

    useEffect(() => {
        if (!boardReady) return;
        const notes = intervals.map(offset => (root + offset) % 12);
        setImageUrl(drawFretboard(boardImageRef.current, { tuning, notes, root, type }));
    }, [boardReady, tuning, intervals, root, type]);

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
                    <span className="field-label">Root</span>
                    <NoteSelect value={root} onChange={setRoot} />
                </div>

                <div className="field">
                    <span className="field-label">Tuning</span>
                    <div className="tuning">
                        {tuning.map((defaultNote, i) => (
                            <div className="tuning-string" key={i}>
                                <NoteSelect
                                    value={defaultNote}
                                    onChange={(val) => handleTuningChange(i, val)}
                                />
                                <span className="tuning-string-number">{6 - i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="field">
                    <span className="field-label">Intervals from root</span>
                    <div className="intervals-grid">
                        {INTERVAL_LABELS.map((label, offset) => (
                            <IntervalChip
                                key={offset}
                                label={label}
                                noteName={NOTE_NAMES[(root + offset) % 12]}
                                checked={offset === 0 || intervals.includes(offset)}
                                fixed={offset === 0}
                                onToggle={() => handleIntervalToggle(offset)}
                            />
                        ))}
                    </div>
                </div>

                <div className="field">
                    <span className="field-label">Show as</span>
                    <SegmentedToggle
                        options={[['Interval', 'interval'], ['Note', 'note']]}
                        value={type}
                        onChange={setType}
                    />
                </div>
            </div>

            <div className="image-container">
                {imageUrl && <img src={imageUrl} alt="Fretboard" />}
            </div>
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
