import Head from "next/head";
import { Inter } from "next/font/google";
import PriceData from "@/components/PriceData";
import SymbolSelector from "@/components/SymbolSelector";
import { connectSocket, disconnect } from '@/reducers/socketSlice';
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectSocket());
    return () => {
      dispatch(disconnect());
    };
  }, []);


  return (
    <>
      <Head>
        <title>Fomo Factory</title>
        <link href="https://unpkg.com/sanitize.css" rel="stylesheet"/>
        <meta name="description" content="Fomo Factory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <SymbolSelector/>
        <PriceData />
      </main>
    </>
  );
}
