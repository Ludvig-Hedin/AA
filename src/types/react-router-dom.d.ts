declare module 'react-router-dom' {
  export function BrowserRouter(props: any): JSX.Element;
  export function Routes(props: any): JSX.Element;
  export function Route(props: any): JSX.Element;
  export function Link(props: any): JSX.Element;
  export function useNavigate(): (path: string) => void;
  export function Navigate(props: any): JSX.Element;
} 