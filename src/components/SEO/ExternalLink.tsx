import React from "react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  nofollow?: boolean;
  sponsored?: boolean;
  ugc?: boolean;
  newTab?: boolean;
  title?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  className = "",
  nofollow = true,
  sponsored = false,
  ugc = false,
  newTab = true,
  title,
  ...props
}) => {
  const isExternal = href.startsWith("http") && !href.includes("findlist.net");

  const relValues = [];
  if (isExternal || nofollow) relValues.push("nofollow");
  if (sponsored) relValues.push("sponsored");
  if (ugc) relValues.push("ugc");
  if (newTab) relValues.push("noopener", "noreferrer");

  const rel = relValues.length > 0 ? relValues.join(" ") : undefined;

  return (
    <a
      href={href}
      className={className}
      rel={rel}
      target={newTab ? "_blank" : undefined}
      title={title}
      {...props}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
