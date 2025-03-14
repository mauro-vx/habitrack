import { signIn, signUp } from '@/lib/actions'

export default function signInPage() {
  return (
    <form className="flex flex-col w-1/2 gap-4 bg-green-200 text-black">
      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
      </div>

      <button formAction={signIn} className="w-fit bg-blue-200 p-2">Sign in</button>
      <button formAction={signUp} className="w-fit bg-blue-200 p-2">Sign up</button>
    </form>
  );
}