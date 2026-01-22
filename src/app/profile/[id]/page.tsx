export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>UserProfile</h1>
      <hr />
      <p className="text-4xl">
        This is the user profile page with the userID:{' '}
        <span className="bg-amber-500 text-gray-950 p-3">{id}</span>.
      </p>
    </div>
  );
}
