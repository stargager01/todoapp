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

  // 사용자별 Firestore 컬렉션 실시간 구독
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, 'users', uid, 'todos'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTodos(data);
    });

    return unsubscribe;
  }, [uid]);

  const addTodo = async (text) => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'users', uid, 'todos'), {
      text,
      status: 'todo', // 'todo' | 'done' | 'stopped'
      createdAt: Date.now(),
    });
  };

  // 클릭할 때마다 todo → done → stopped → todo 순환
  const cycleStatus = async (id, currentStatus) => {
    const next = { todo: 'done', done: 'stopped', stopped: 'todo' };
    await updateDoc(doc(db, 'users', uid, 'todos', id), {
      status: next[currentStatus] ?? 'done',
    });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, 'users', uid, 'todos', id));
  };

  return { todos, addTodo, cycleStatus, remove };
}
