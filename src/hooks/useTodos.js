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
      done: false,
      createdAt: Date.now(),
    });
  };

  const toggle = async (id, done) => {
    // 불변성: Firestore 문서만 업데이트, 로컬 배열 직접 수정 안 함
    await updateDoc(doc(db, 'users', uid, 'todos', id), { done: !done });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, 'users', uid, 'todos', id));
  };

  return { todos, addTodo, toggle, remove };
}
