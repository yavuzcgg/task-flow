interface FooterProps {
  dict: {
    copyright: string;
  };
}

export function Footer({ dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t px-4 py-6">
      <p className="text-center text-sm text-muted-foreground">
        &copy; {year} {dict.copyright}
      </p>
    </footer>
  );
}
