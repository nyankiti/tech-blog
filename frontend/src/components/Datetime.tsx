import { format as formatter } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { ComponentProps, FC } from 'react';

type Props = {
  datetime: string;
  format: string;
} & Omit<ComponentProps<'time'>, 'children' | 'dateTime'>;

export const Datetime: FC<Props> = ({ datetime, format, ...props }) => {
  const date = toZonedTime(datetime, 'Asia/Tokyo');

  return (
    <time dateTime={datetime} {...props}>
      {formatter(date, format)}
    </time>
  );
};
