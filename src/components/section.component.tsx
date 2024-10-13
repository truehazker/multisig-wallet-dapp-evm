import { HTMLAttributes } from 'react';

interface ISectionProps extends HTMLAttributes<HTMLElement> {
  direction?: 'row' | 'col';
}

export const Section = (props: ISectionProps) => {
  const { className, children, direction = 'col', ...rest } = props;
  const classes = className ? className : '';

  return (
    <section
      className={`flex flex-${direction} gap-10 items-center w-full py-4 px-5 md:py-8 md:px-10 ${classes}`}
      {...rest}>
      {children}
    </section>
  );
};
