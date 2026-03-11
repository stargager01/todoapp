import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

export function useTodos(uid) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'users', uid, 'todos'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTodos(data);
    });
    return unsubscribe;
  }, [uid]);

  const addTodo = async (text, dueDate = null) => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'users', uid, 'todos'), {
      text,
      status: 'todo',
      createdAt: Date.now(),
      dueDate: dueDate ?? null,
    });
  };

  const cycleStatus = async (id, currentStatus) => {
    const next = { todo: 'done', done: 'stopped', stopped: 'todo' };
    await updateDoc(doc(db, 'users', uid, 'todos', id), {
      status: next[currentStatus] ?? 'done',
    });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, 'users', uid, 'todos', id));
  };

  const updateDueDate = async (id, dueDate) => {
    await updateDoc(doc(db, 'users', uid, 'todos', id), {
      dueDate: dueDate ?? null,
    });
  };

  return { todos, addTodo, cycleStatus, remove, updateDueDate };
}
