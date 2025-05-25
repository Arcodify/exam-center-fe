import Footer from '@/components/footer/footer';
import Header from '@/components/header/Header';
import { HeaderProvider } from '@/components/header/HeaderContext'; // Make sure to import this

const AppLayout = (props: { children?: JSX.Element }) => {
  return (
    <HeaderProvider>
      <div className="main">
        <Header />
        <main className="mx-auto max-w-screen-xl">{props.children}</main>
        <Footer />
      </div>
    </HeaderProvider>
  );
};

export default AppLayout;
