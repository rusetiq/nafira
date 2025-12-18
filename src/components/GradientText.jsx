import clsx from 'clsx';

export default function GradientText({ children, className }) {
  return <span className={clsx('gradient-text', className)}>{children}</span>;
}
