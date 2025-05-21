
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/design');
  // return null; // redirect will handle this
}
