import {
  Await as RrdAwait,
  defer,
  LoaderFunctionArgs,
  useLoaderData as useRrdLoaderData,
} from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';

export function useLoaderData<
  TLoader extends ReturnType<typeof deferredLoader>
>() {
  return useRrdLoaderData() as ReturnType<TLoader>['data'];
}

export function deferredLoader<TData extends Record<string, unknown>>(
  dataFunc: (args: LoaderFunctionArgs) => TData
) {
  return (args: LoaderFunctionArgs) =>
    defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & {
      data: TData;
    };
}

export interface AwaitResolveRenderFunction<T> {
  (data: Awaited<T>): ReactElement;
}

export interface AwaitProps<T> {
  children: ReactNode | AwaitResolveRenderFunction<T>;
  errorElement?: ReactNode;
  resolve: Promise<T>;
}

export function Await<T>(props: AwaitProps<T>): JSX.Element {
  return RrdAwait(props);
}
