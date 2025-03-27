type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {children}
    </div>
  );
}
