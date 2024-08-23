'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectExampleValue, increment, decrement } from '@/redux/slices/example';

export default function Counter() {
  const count = useAppSelector(selectExampleValue);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}