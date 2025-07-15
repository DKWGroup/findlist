import React from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
}

const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = "",
  id,
  tabIndex,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  // Default styling based on level
  const getDefaultClasses = (level: number) => {
    switch (level) {
      case 1:
        return "text-4xl font-bold text-gray-900 mb-6";
      case 2:
        return "text-3xl font-semibold text-gray-900 mb-4";
      case 3:
        return "text-2xl font-semibold text-gray-900 mb-3";
      case 4:
        return "text-xl font-medium text-gray-900 mb-2";
      case 5:
        return "text-lg font-medium text-gray-900 mb-2";
      case 6:
        return "text-base font-medium text-gray-900 mb-1";
      default:
        return "";
    }
  };

  const classes = className || getDefaultClasses(level);

  return (
    <Tag className={classes} id={id} tabIndex={tabIndex} {...props}>
      {children}
    </Tag>
  );
};

// Export specific heading components for convenience
export const H1: React.FC<Omit<HeadingProps, "level">> = (props) => (
  <Heading level={1} {...props} />
);

export const H2: React.FC<Omit<HeadingProps, "level">> = (props) => (
  <Heading level={2} {...props} />
);

export const H3: React.FC<Omit<HeadingProps, "level">> = (props) => (
  <Heading level={3} {...props} />
);

export const H4: React.FC<Omit<HeadingProps, "level">> = (props) => (
  <Heading level={4} {...props} />
);

export const H5: React.FC<Omit<HeadingProps, "level">> = (props) => (
  <Heading level={5} {...props} />
);

export const H6: React.FC<Omit<HeadingProps, "level">> = (props) => (
  <Heading level={6} {...props} />
);

export default Heading;
