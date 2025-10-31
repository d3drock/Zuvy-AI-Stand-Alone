export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-h5 font-bold mb-4">Unauthorized</h1>
        <p className="text-body1 text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
