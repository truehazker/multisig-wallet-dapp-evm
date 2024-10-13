import { HTMLAttributes } from 'react';

interface ISectionProps extends HTMLAttributes<HTMLElement> {
  direction?: 'row' | 'col';
}

export const Container = (props: ISectionProps) => {
  const { className, children, direction = 'col', ...rest } = props;
  const classes = className ? className : '';

  return (
    <div
      className={`flex gap-8 w-full max-w-5xl flex-${direction} ${classes}`} {...rest}>
      {children}
    </div>
  );
};
