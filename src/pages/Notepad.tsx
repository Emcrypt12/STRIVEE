import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, SortDesc, SortAsc } from 'lucide-react';
import { format } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Notepad() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project kickoff meeting',
      content: 'Discussed project timeline, deliverables, and assigned responsibilities to team members. Next steps include setting up the initial project structure and planning the first sprint.',
      tags: ['work', 'meeting'],
      createdAt: new Date('2025-03-10T10:00:00'),
      updatedAt: new Date('2025-03-10T10:00:00')
    },
    {
      id: '2',
      title: 'Ideas for new features',
      content: 'Add dark mode support, implement notification system, create mobile app version, improve search functionality with filters.',
      tags: ['ideas', 'features'],
      createdAt: new Date('2025-03-12T14:30:00'),
      updatedAt: new Date('2025-03-12T14:30:00')
    },
    {
      id: '3',
      title: 'Weekly goals',
      content: '1. Complete project proposal\n2. Review team progress\n3. Research new technologies\n4. Plan next quarter objectives\n5. Update documentation',
      tags: ['goals', 'personal'],
      createdAt: new Date('2025-03-15T09:15:00'),
      updatedAt: new Date('2025-03-15T09:15:00')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  }).sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.updatedAt.getTime() - b.updatedAt.getTime();
    } else {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      tags: newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes([...notes, newNote]);
    resetForm();
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNoteTitle.trim()) return;
    
    setNotes(notes.map(note => {
      if (note.id === editingNote.id) {
        return {
          ...note,
          title: newNoteTitle,
          content: newNoteContent,
          tags: newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          updatedAt: new Date()
        };
      }
      return note;
    }));
    
    resetForm();
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setNewNoteTags(note.tags.join(', '));
    setShowAddNoteForm(true);
  };

  const resetForm = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    setEditingNote(null);
    setShowAddNoteForm(false);
  };

  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notepad</h1>
        <button
          onClick={() => setShowAddNoteForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 input appearance-none"
              value={selectedTags.length > 0 ? 'filtered' : ''}
              onChange={() => {}} // This is handled by individual tag selections
            >
              <option value="">All Tags</option>
              {selectedTags.length > 0 && (
                <option value="filtered">{selectedTags.join(', ')}</option>
              )}
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={toggleSortOrder}
              className="btn btn-outline flex items-center"
            >
              {sortOrder === 'desc' ? (
                <>
                  <SortDesc className="mr-2 h-4 w-4" />
                  Newest First
                </>
              ) : (
                <>
                  <SortAsc className="mr-2 h-4 w-4" />
                  Oldest First
                </>
              )}
            </button>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTagSelection(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Note Form */}
      {showAddNoteForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingNote ? 'Edit Note' : 'Add New Note'}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="note-title" className="label">Title</label>
              <input
                id="note-title"
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note title"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="note-content" className="label">Content</label>
              <textarea
                id="note-content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your note here..."
                rows={6}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="note-tags" className="label">Tags (comma-separated)</label>
              <input
                id="note-tags"
                type="text"
                value={newNoteTags}
                onChange={(e) => setNewNoteTags(e.target.value)}
                placeholder="work, ideas, personal..."
                className="input"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={editingNote ? handleUpdateNote : handleAddNote}
                className="btn btn-primary"
              >
                {editingNote ? 'Update Note' : 'Add Note'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditNote(note)}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-error-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4 whitespace-pre-line">
                {note.content.length > 150 
                  ? `${note.content.substring(0, 150)}...` 
                  : note.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {format(note.updatedAt, "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-100 text-center">
          <p className="text-gray-500">No notes found. Try adjusting your filters or create a new note.</p>
        </div>
      )}
    </div>
  );
}