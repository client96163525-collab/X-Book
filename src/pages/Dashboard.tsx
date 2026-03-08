import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { Plus, Book as BookIcon, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Book } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'books'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Book[];
        
        // Sort client-side to avoid Firestore index requirement
        booksData.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
        
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <Link
          to="/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first book.</p>
          <div className="mt-6">
            <Link
              to="/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Book
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 relative group"
            >
              <Link to={`/editor/${book.id}`} className="block p-6">
                <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md mb-4 border border-gray-100">
                   <BookIcon className="h-16 w-16 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 truncate">{book.author || 'Unknown Author'}</p>
                <div className="mt-4 flex items-center text-xs text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {book.createdAt?.toDate().toLocaleDateString()}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
