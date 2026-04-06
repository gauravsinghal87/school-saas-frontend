import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassSubjects } from "../../../api/apiMehods";
import { removeClassSubjectsMutation } from "../../../hooks/useQueryMutations";
import toast from "react-hot-toast";

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Grid: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  List: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line x1="8" y1="6" x2="21" y2="6" strokeWidth={2} />
      <line x1="8" y1="12" x2="21" y2="12" strokeWidth={2} />
      <line x1="8" y1="18" x2="21" y2="18" strokeWidth={2} />
      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth={2} />
      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth={2} />
      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth={2} />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  SelectAll: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
      <polyline points="9 12 11 14 15 10" strokeWidth={2} />
    </svg>
  ),
  Minus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12" strokeWidth={2} />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Spinner: () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   SUBJECT COLOR MAPPING
═══════════════════════════════════════════════════════════════ */
const SUBJECT_COLORS = {
  Math: 'primary', Maths: 'primary',
  Science: 'info', Physics: 'info', Chemistry: 'danger',
  Biology: 'success', English: 'success',
  Hindi: 'secondary', Sanskrit: 'warning',
  SST: 'purple', History: 'secondary', Geography: 'info',
  Computer: 'primary', GKS: 'warning',
};

const EMOJI_MAP = {
  Math: '📐', Science: '🔬', Physics: '⚡', Chemistry: '🧪',
  Biology: '🧬', English: '📝', Hindi: '📖', Sanskrit: '🕉️',
  SST: '🌏', History: '📜', Geography: '🗺️', Computer: '💻',
  GKS: '🌟', default: '📚',
};

const getSubjectStyle = (name, index = 0) => {
  const key = Object.keys(SUBJECT_COLORS).find(
    k => k.toLowerCase() === name?.toLowerCase()
  );
  const colorVar = key ? SUBJECT_COLORS[key] : ['primary', 'info', 'success', 'warning', 'secondary'][index % 5];
  const emoji = key ? EMOJI_MAP[key] : EMOJI_MAP.default;
  return { colorVar, emoji };
};

/* ═══════════════════════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════════════════════ */
function ConfirmDialog({ isOpen, onConfirm, onCancel, count, isPending }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <Icons.Trash />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Remove {count} Subject{count > 1 ? 's' : ''}?
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {count === 1
              ? 'This subject will be permanently removed from this class.'
              : `These ${count} subjects will be permanently removed from this class.`}
            <br />This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 px-4 py-2 rounded-xl border border-border text-text-secondary font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 px-4 py-2 rounded-xl bg-error text-white font-medium hover:bg-error/90 transition flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Icons.Spinner /> Removing...</>
              ) : (
                <><Icons.Trash /> Remove</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBJECT CARD - Grid View
═══════════════════════════════════════════════════════════════ */
function SubjectCard({ subject, index, selected, onSelect }) {
  const { colorVar, emoji } = getSubjectStyle(subject.name, index);
  const date = subject.createdAt
    ? new Date(subject.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const getColorClass = (shade) => {
    const colors = {
      primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', gradient: 'from-primary to-primary/70' },
      success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', gradient: 'from-success to-success/70' },
      error: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/30', gradient: 'from-error to-error/70' },
      warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', gradient: 'from-warning to-warning/70' },
      info: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30', gradient: 'from-info to-info/70' },
      secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30', gradient: 'from-secondary to-secondary/70' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300', gradient: 'from-purple-500 to-purple-600' },
    };
    return colors[colorVar] || colors.primary;
  };

  const colorStyle = getColorClass();

  return (
    <div
      className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
        selected
          ? `${colorStyle.border} ${colorStyle.bg} shadow-lg`
          : 'border-border bg-surface-card hover:border-primary/40 hover:shadow-md'
      }`}
      onClick={() => onSelect(subject._id)}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          selected
            ? `bg-${colorVar} border-${colorVar} shadow-sm`
            : 'border-gray-300 bg-white'
        }`}
        onClick={e => { e.stopPropagation(); onSelect(subject._id); }}
      >
        {selected && <Icons.Check />}
      </div>

      {/* Index Badge */}
      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorStyle.bg} ${colorStyle.text} mb-3`}>
        #{String(index + 1).padStart(2, '0')}
      </div>

      {/* Emoji Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorStyle.gradient} flex items-center justify-center text-2xl shadow-lg mb-3`}>
        {emoji}
      </div>

      {/* Title */}
      <h3 className="font-bold text-text-primary text-lg mb-1">{subject.name}</h3>

      {/* Description */}
      <p className="text-text-secondary text-xs line-clamp-2 mb-3">
        {subject.description || 'No description provided'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-text-secondary">{date}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CLASS SUBJECTS COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ClassSubjects() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync: removeSubjects } = removeClassSubjectsMutation();

  // Fetch subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await getClassSubjects(id);
      setSubjects(res.results || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [id]);

  // Filter subjects
  const filteredSubjects = useMemo(() => {
    if (!search.trim()) return subjects;
    const q = search.toLowerCase();
    return subjects.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  }, [subjects, search]);

  // Selection handlers
  const toggleSelect = (subjectId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(subjectId)) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubjects.map(s => s._id)));
    }
  };

  // Delete handler - API CALL
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await removeSubjects({
        id: id,
        data: { subjectIds: Array.from(selectedIds) }
      });
      
      if (result?.success) {
        // toast.success(`${selectedIds.size} subject${selectedIds.size > 1 ? 's' : ''} removed successfully`);
        setSelectedIds(new Set());
        setConfirmOpen(false);
        fetchSubjects(); // Refresh the list
      } else {
        toast.error(result?.message || 'Failed to remove subjects');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to remove subjects');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = subjects.length;
  const selectedCount = selectedIds.size;
  const allSelected = filteredSubjects.length > 0 && selectedIds.size === filteredSubjects.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-all duration-200"
          >
            <Icons.ArrowLeft />
            <span className="font-medium">Back to Classes</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 via-info/5 to-purple-500/5 border border-primary/10 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg">
                <Icons.BookOpen />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-heading">
                  Class Subjects
                </h1>
                <p className="text-text-secondary mt-1">
                  {loading ? 'Loading...' : `${totalCount} subject${totalCount !== 1 ? 's' : ''} assigned`}
                </p>
              </div>
            </div>
            {!loading && totalCount > 0 && (
              <div className="px-6 py-3 rounded-xl bg-surface-card border border-border text-center shadow-sm">
                <div className="text-3xl font-bold text-primary">{totalCount}</div>
                <div className="text-xs text-text-secondary uppercase font-semibold">Total Subjects</div>
              </div>
            )}
          </div>

          {/* Subject Pills Preview */}
          {!loading && subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border/50">
              {subjects.slice(0, 8).map((s, i) => {
                const { emoji, colorVar } = getSubjectStyle(s.name, i);
                const colorMap = {
                  primary: 'bg-primary/10 text-primary',
                  success: 'bg-success/10 text-success',
                  error: 'bg-error/10 text-error',
                  warning: 'bg-warning/10 text-warning',
                  info: 'bg-info/10 text-info',
                  secondary: 'bg-secondary/10 text-secondary',
                };
                return (
                  <span key={s._id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorMap[colorVar] || colorMap.primary}`}>
                    <span>{emoji}</span> {s.name}
                  </span>
                );
              })}
              {subjects.length > 8 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{subjects.length - 8} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Toolbar */}
        {!loading && subjects.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search subjects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Select All Button */}
              <button
                onClick={toggleSelectAll}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  allSelected
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : someSelected
                    ? 'bg-gray-100 text-gray-700 border border-gray-200'
                    : 'bg-surface-card border border-border text-text-secondary hover:text-primary hover:border-primary/30'
                }`}
              >
                {someSelected ? <Icons.Minus /> : <Icons.SelectAll />}
                {allSelected ? 'Deselect All' : someSelected ? 'Clear' : 'Select All'}
              </button>

              {/* View Toggle */}
              <div className="flex gap-1 p-1 rounded-xl bg-gray-100 border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-surface-card text-primary shadow-sm'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                  title="Grid view"
                >
                  <Icons.Grid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-surface-card text-primary shadow-sm'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                  title="List view"
                >
                  <Icons.List />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Action Bar */}
        {selectedCount > 0 && (
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {selectedCount}
              </div>
              <span className="font-semibold text-text-primary">
                subject{selectedCount > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-4 py-2 rounded-lg border border-border bg-surface-card text-text-secondary hover:text-text-primary hover:border-gray-400 transition"
              >
                Clear
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-error text-white font-semibold hover:bg-error/90 transition shadow-md"
              >
                <Icons.Trash />
                Remove {selectedCount} Subject{selectedCount > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <p className="mt-4 text-text-secondary">Loading subjects...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && subjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-info/10 flex items-center justify-center text-5xl mb-5">
              📚
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Subjects Assigned</h3>
            <p className="text-text-secondary mb-5 max-w-md">
              This class doesn't have any subjects assigned yet.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition shadow-md"
            >
              <Icons.ArrowLeft />
              Go Back
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && subjects.length > 0 && filteredSubjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No matches found</h3>
            <p className="text-text-secondary">
              No subjects match "{search}"
            </p>
          </div>
        )}

        {/* Grid/List View */}
        {!loading && filteredSubjects.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSubjects.map((subject, idx) => (
                  <SubjectCard
                    key={subject._id}
                    subject={subject}
                    index={idx}
                    selected={selectedIds.has(subject._id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredSubjects.map((subject, idx) => {
                  const { colorVar, emoji } = getSubjectStyle(subject.name, idx);
                  const isSelected = selectedIds.has(subject._id);
                  const date = subject.createdAt
                    ? new Date(subject.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';

                  const getColorClass = () => {
                    const colors = {
                      primary: 'border-primary/40 bg-primary/5',
                      success: 'border-success/40 bg-success/5',
                      error: 'border-error/40 bg-error/5',
                      warning: 'border-warning/40 bg-warning/5',
                      info: 'border-info/40 bg-info/5',
                      secondary: 'border-secondary/40 bg-secondary/5',
                    };
                    return colors[colorVar] || colors.primary;
                  };

                  return (
                    <div
                      key={subject._id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:translate-x-1 ${
                        isSelected
                          ? `${getColorClass()} shadow-md`
                          : 'border-border bg-surface-card hover:border-primary/30'
                      }`}
                      onClick={() => toggleSelect(subject._id)}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? `bg-${colorVar} border-${colorVar}` : 'border-gray-300 bg-white'
                        }`}
                        onClick={e => { e.stopPropagation(); toggleSelect(subject._id); }}
                      >
                        {isSelected && <Icons.Check />}
                      </div>

                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${colorVar} to-${colorVar}/70 flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                        {emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-text-primary">{subject.name}</h4>
                        <p className="text-text-secondary text-sm truncate">
                          {subject.description || 'No description'}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs text-text-secondary">{date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Count */}
            <div className="text-center mt-6 text-sm text-text-secondary">
              Showing <strong className="text-text-primary">{filteredSubjects.length}</strong> of{' '}
              <strong className="text-text-primary">{totalCount}</strong> subjects
              {search && ` · matching "${search}"`}
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        count={selectedCount}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}